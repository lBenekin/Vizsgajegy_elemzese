import { getStudents } from "./studentApi.js";
import { updateSubjectEditor } from "./subjectEditor.js";

export let students = [];
export let selectedStudent = null;

export async function loadStudents() {
  students = await getStudents();
  const tableBody = document.querySelector("#studentsTable tbody");
  tableBody.innerHTML = "";

  if (students.length === 0) {
    tableBody.innerHTML = `<tr class="no-hover"><td colspan="4" class="text-center">Nincs elérhető tanuló</td></tr>`;
    return;
  }

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.id = student.id;

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${new Date(student.dateOfBirth).toLocaleDateString()}</td>
      <td>${student.email}</td>
      <td style="color: ${student.subjects.length ? "black" : "red"}">
        ${student.subjects.length ? student.subjects.map((s) => s.name).join(", ") : "Még nincs tárgya"}
      </td>
    `;

    row.addEventListener("click", () => selectStudent(student, row));
    tableBody.appendChild(row);
  });
}

function selectStudent(student, row) {
  document.querySelectorAll("#studentsTable tbody tr").forEach((r) => r.classList.remove("active-row"));
  row.classList.add("active-row");
  selectedStudent = student;

  document.getElementById("nameBox").value = student.name;
  document.getElementById("emailBox").value = student.email;
  document.getElementById("dateBox").value = new Date(student.dateOfBirth).toISOString().split("T")[0];

  const rightDiv = document.getElementById("right");
  rightDiv.innerHTML = "";
  student.subjects.forEach((subject) => {
    const subjectElement = document.createElement("div");
    subjectElement.classList.add("list");
    subjectElement.draggable = true;
    subjectElement.id = subject.id;
    subjectElement.textContent = subject.name;
    rightDiv.appendChild(subjectElement);
  });

  updateSubjectEditor();
}
