from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:main_project@localhost/career_axis"

engine = create_engine(DATABASE_URL)
