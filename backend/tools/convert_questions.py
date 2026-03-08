#!/usr/bin/env python3
"""
Convert question lists (CSV / JSON / Excel via pandas) into the sample JSON
format required by the loader (`backend/sample_questions/*.json`).

Usage examples:
  python convert_questions.py --input questions.csv --company "Acme" --section "Technical"
  python convert_questions.py --input raw_questions.json

Behavior:
 - CSV: expects columns like `question`, `options`, `answer`, `difficulty`, `id` (optional),
   `source` (optional), `company` (optional), `section` (optional), `branch` (optional).
   `options` may be a JSON array string or separated by `;` or `|`.
 - JSON: if input already contains the expected structure it will be validated and re-saved
   into `sample_questions/`.
 - Excel: attempted if `pandas` is available.

Validation performed:
 - Each question must have `question`, `options` (list with >=2 items), and `answer`.
 - `answer` should appear in `options` (warning if not).

Output: writes a JSON file into `backend/sample_questions/<company>-<section>.json`.
"""

import argparse
import csv
import json
import os
import sys
from pathlib import Path


def parse_options_field(val: str):
    if val is None:
        return []
    val = val.strip()
    if not val:
        return []
    # If looks like JSON array
    if val.startswith('[') and val.endswith(']'):
        try:
            return json.loads(val)
        except Exception:
            pass
    # Common separators
    for sep in ['||', ';', '|', '\n', '\t', ',']:
        if sep in val:
            parts = [p.strip() for p in val.split(sep) if p.strip()]
            if len(parts) > 1:
                return parts
    # Single option string fallback
    return [val]


def read_csv(path: Path):
    rows = []
    with path.open('r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    return rows


def read_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def read_with_pandas(path: Path):
    try:
        import pandas as pd
    except Exception as e:
        raise RuntimeError('pandas not available') from e
    df = pd.read_excel(path)
    return df.to_dict(orient='records')


def build_output(company, section, branch, rows):
    output = {
        'company': company or 'Unknown',
        'section': section or 'Technical',
        'branch': branch or 'ALL',
        'total_questions': 0,
        'questions': []
    }

    problems = []

    for idx, r in enumerate(rows, start=1):
        qtext = r.get('question') or r.get('Question') or r.get('question_text')
        if not qtext:
            problems.append(f'Row {idx}: missing question text')
            continue

        raw_options = r.get('options') or r.get('Options') or r.get('choices') or r.get('choices_list')
        options = parse_options_field(raw_options) if isinstance(raw_options, str) else raw_options or []

        # If options is a string inside JSON rows, handle that
        if isinstance(options, str):
            options = parse_options_field(options)

        answer = r.get('answer') or r.get('Answer') or r.get('correct_answer')
        difficulty = (r.get('difficulty') or r.get('Difficulty') or 'easy').lower()
        qid = r.get('id') or r.get('ID') or f'Q{idx:03d}'
        source = r.get('source') or 'manual'

        if not isinstance(options, list) or len(options) < 2:
            problems.append(f'Row {idx}: insufficient options ({options})')

        if not answer:
            problems.append(f'Row {idx}: missing answer')
        else:
            # If answer is an index like 0/1/2, try to map to options
            if isinstance(answer, str) and answer.isdigit():
                ai = int(answer)
                if 0 <= ai < len(options):
                    answer = options[ai]

        if answer and options and answer not in options:
            problems.append(f'Row {idx}: answer "{answer}" not in options {options}')

        qobj = {
            'id': str(qid),
            'question': qtext,
            'options': options,
            'answer': answer,
            'difficulty': difficulty,
            'source': source
        }

        output['questions'].append(qobj)

    output['total_questions'] = len(output['questions'])
    return output, problems


def main(argv=None):
    parser = argparse.ArgumentParser(description='Convert question lists to sample JSON for loader')
    parser.add_argument('--input', '-i', required=True, help='Input file (CSV, JSON, or Excel)')
    parser.add_argument('--company', '-c', help='Company name (overrides file)')
    parser.add_argument('--section', '-s', help='Section / exam_type (overrides file)')
    parser.add_argument('--branch', '-b', help='Branch (optional)')
    parser.add_argument('--output', '-o', help='Output path (optional). If omitted writes to backend/sample_questions/<company>-<section>.json')

    args = parser.parse_args(argv)
    path = Path(args.input)
    if not path.exists():
        print('Input file not found:', path)
        sys.exit(2)

    ext = path.suffix.lower()
    rows = None
    raw = None

    try:
        if ext in ['.csv']:
            rows = read_csv(path)
        elif ext in ['.json']:
            raw = read_json(path)
            # If already in expected format with keys company/section/questions
            if isinstance(raw, dict) and 'questions' in raw:
                output = raw
                problems = []
            else:
                # assume raw is a list of row dicts
                rows = raw
        elif ext in ['.xls', '.xlsx']:
            rows = read_with_pandas(path)
        else:
            print('Unsupported extension:', ext)
            sys.exit(2)
    except Exception as e:
        print('Error reading input:', e)
        sys.exit(3)

    if rows is not None:
        # get overrides
        # try to detect company/section/branch from first row if present
        first = rows[0] if len(rows) else {}
        company = args.company or first.get('company') or first.get('Company')
        section = args.section or first.get('section') or first.get('section_name') or first.get('section')
        branch = args.branch or first.get('branch')

        output, problems = build_output(company, section, branch, rows)

    # If raw already matched expected
    if raw is not None and isinstance(raw, dict) and 'questions' in raw:
        output = raw
        problems = []

    # Determine output path
    out_path = Path(args.output) if args.output else Path(__file__).parent.parent / 'sample_questions' / f"{output.get('company','unknown').replace(' ','_')}-{output.get('section','all').replace(' ','_')}.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with out_path.open('w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f'Wrote {out_path} with {output.get("total_questions",0)} questions')
    if problems:
        print('\nValidation warnings:')
        for p in problems:
            print(' -', p)
    else:
        print('No validation problems detected.')


if __name__ == '__main__':
    main()
