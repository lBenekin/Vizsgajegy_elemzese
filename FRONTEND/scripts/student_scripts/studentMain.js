import { loadStudents, selectedStudent } from "./studentDom.js";
import { addStudent as apiAdd, updateStudent, updateStudentSubjects, deleteStudent as apiDelete } from "./studentApi.js";
import { clearInputs, hasEmpty } from "../utils.js";

document.getElementById("addStudentButton").addEventListener("click", addStudent);
document.getElementById("save-button").addEventListener("click", saveStudent);
document.getElementById("delete-button").addEventListener("click", deleteStudent);

loadStudents();

async function addStudent() {
  const name = document.getElementById("addNameBox").value;
  const date = document.getElementById("addDateBox").value;
  const email = document.getElementById("addEmailBox").value;
  if (!hasEmpty(name, date, email)) {
    await apiAdd({ name, dateOfBirth: date, email });
    loadStudents();
    clearInputs();
  }
}

async function saveStudent() {
  if (!selectedStudent) return alert("Nincs kiválasztott tanuló!");

  const name = document.getElementById("nameBox").value;
  const email = document.getElementById("emailBox").value;
  const date = document.getElementById("dateBox").value;

  if (!hasEmpty(name, email, date)) {
    const updatedStudent = {
      name: name,
      email: email,
      dateOfBirth: date,
    };
    await updateStudent(selectedStudent.id, updatedStudent);

    const rightDiv = document.getElementById("right");
    const subjectIds = Array.from(rightDiv.children).map((subjectElement) => parseInt(subjectElement.id));
    await updateStudentSubjects(selectedStudent.id, subjectIds);

    loadStudents();
    clearInputs();
  }
}

async function deleteStudent() {
  if (!selectedStudent) return alert("Nincs kiválasztott tanuló!");
  const confirmed = confirm(`Biztosan törlöd: ${selectedStudent.name}?`);
  if (confirmed) {
    await apiDelete(selectedStudent.id);
    loadStudents();
    clearInputs();
  }
}
