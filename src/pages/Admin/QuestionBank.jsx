import React from "react";

export default function QuestionBank() {

const questions = [
{
id:1,
question:"What is polymorphism?",
domain:"Programming",
difficulty:"Easy",
source:"Admin"
},
{
id:2,
question:"Binary search complexity?",
domain:"Programming",
difficulty:"Medium",
source:"AI"
}
];

return (

<div className="admin-container">

<h2>Question Bank</h2>

<table className="admin-table">

<thead>
<tr>
<th>Question</th>
<th>Domain</th>
<th>Difficulty</th>
<th>Source</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{questions.map((q)=>(
<tr key={q.id}>

<td>{q.question}</td>
<td>{q.domain}</td>
<td>{q.difficulty}</td>
<td>{q.source}</td>

<td>

<button>👁 View</button>
<button>✏ Edit</button>
<button>🗑 Delete</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

);

}