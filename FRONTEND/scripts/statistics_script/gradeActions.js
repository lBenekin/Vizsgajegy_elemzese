import { addGradeApi, editGradeApi, deleteGradeApi } from "./statisticsApi.js";
import { showGrades, showStatistics } from "./gradeDisplay.js";
import { getGradientBackground } from "../utils.js";
let selectedStudentId;
let selectedSubjectId;
export function setSelectionForGradeAction(studentId, subjectId) {
  selectedStudentId = studentId;
  selectedSubjectId = subjectId;
}
export async function addGrade() {
  const gradeValue = document.querySelector('#gradeRadiosContainer input[name="grade"]:checked').value;
  const comment = document.getElementById("commentInput");
  const newGrade = {
    studentId: selectedStudentId,
    subjectId: selectedSubjectId,
    gradeValue: gradeValue,
    comment: comment.value,
  };
  comment.value = "";
  if (selectedStudentId && selectedSubjectId) {
    await addGradeApi(newGrade);
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  }
}
export async function deleteGrade(e) {
  const gradeId = e.target.closest("tr").id;
  await deleteGradeApi(gradeId);
  await showGrades(selectedStudentId, selectedSubjectId);
  await showStatistics(selectedStudentId, selectedSubjectId);
}
export async function editGrade(e) {
  const row = e.target.closest("tr");
  const gradeId = e.target.closest("tr").id;
  const cells = row.querySelectorAll("td");

  //Change button to save button
  const saveButton = row.querySelector("button.edit-button");
  saveButton.style = "background-color:rgb(1, 224, 1);";
  saveButton.innerHTML = "Mentés";

  const gradeCell = cells[0];
  const grade = parseInt(row.querySelector("span").innerHTML);

  const gradeSelector = document.createElement("select");
  gradeSelector.classList.add("selector-grade-style");
  for (let i = 1; i <= 5; i++) {
    const gradeOption = document.createElement("option");
    gradeOption.textContent = i;
    gradeOption.style.backgroundColor = getGradientBackground(i);
    gradeSelector.appendChild(gradeOption);
  }
  gradeSelector.value = grade;
  gradeSelector.style.backgroundColor = getGradientBackground(gradeSelector.value);
  gradeCell.innerHTML = "";
  gradeCell.appendChild(gradeSelector);
  gradeSelector.addEventListener("change", function () {
    this.style.backgroundColor = getGradientBackground(this.value);
  });

  const commentCell = cells[1];
  const comment = commentCell.innerHTML;
  commentCell.innerHTML = "";
  const commentTextArea = document.createElement("textarea");
  commentTextArea.classList.add("comment-input-style");
  commentTextArea.style.maxWidth = "200px";
  commentTextArea.style.margin = "0px";
  commentTextArea.placeholder = "Írd ide a megjegyzést!";
  commentTextArea.value = comment == "Nincs megjegyzés" ? "" : comment;
  commentCell.appendChild(commentTextArea);

  saveButton.onclick = async function () {
    const updatedGrade = {
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      gradeValue: gradeSelector.value,
      comment: commentTextArea.value,
    };
    await editGradeApi(gradeId, updatedGrade);
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  };
}
