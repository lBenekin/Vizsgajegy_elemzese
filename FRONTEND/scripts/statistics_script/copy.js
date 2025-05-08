import {
  addGradeApi,
  deleteGradeApi,
  editGradeApi,
  fetchStudents as fetchStudentsApi,
  fetchSubjectsForStudent as fetchSubjectsForStudentApi,
  fetchGrades,
} from "./statisticsApi.js";
import { getGradientBackground } from "../utils.js";
import { generateHistogram, updateHistogram } from "./histogram.js";
import { drawLineChart } from "./lineChart.js";

let selectedStudentId = null;
let selectedSubjectId = null;
let studentGrades = [];
document.addEventListener("DOMContentLoaded", () => {
  const studentsSelector = document.getElementById("studentsSelector");
  const subjectsSelector = document.getElementById("subjectsSelector");
  fetchStudents();
  generateHistogram();
  drawLineChart([0], []);

  studentsSelector.addEventListener("change", function () {
    selectedStudentId = this.value;
    if (selectedStudentId) {
      fetchSubjectsForStudent(selectedStudentId);
      //showStatistics(selectedStudentId);
    } else {
      clearSubjects(); // Ha nincs kiválasztott diák, töröljük a tárgyakat
    }
  });
  subjectsSelector.addEventListener("change", function () {
    selectedStudentId = studentsSelector.value;
    selectedSubjectId = this.value;
    if (selectedSubjectId) {
      (async () => {
        await showGrades(selectedStudentId, selectedSubjectId);
        await showStatistics(selectedStudentId, selectedSubjectId);
      })();
    } else {
      clearSubjects();
    }
  });
});
async function fetchStudents() {
  let data = await fetchStudentsApi();
  data.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.name;
    studentsSelector.appendChild(option);
  });
}
async function fetchSubjectsForStudent(studentId) {
  subjectsSelector.innerHTML = "";
  let data = await fetchSubjectsForStudentApi(studentId);
  if (data.length === 0) {
    async () => {
      await showGrades(selectedStudentId, selectedSubjectId);
      await showStatistics(selectedStudentId, selectedSubjectId);
    };
  }

  data.forEach((subject, index) => {
    const option = document.createElement("option");
    option.value = subject.id;
    option.textContent = `${subject.name}`;
    if (index === 0) option.selected = true; // első kiválasztása
    subjectsSelector.appendChild(option);
  });
  selectedSubjectId = subjectsSelector.value;
  (async () => {
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  })();
  const addGradeButton = document.getElementById("addGradeButton");
  addGradeButton.onclick = function () {
    addGrade();
  };
}

async function showGrades(studentId, subjectId) {
  const table = document.getElementById("gradesTable");
  const tableBody = table.querySelector("tbody");
  if (!studentId || !subjectId) {
    tableBody.innerHTML = `<tr class="no-hover">
                            <td colspan="4" class="text-center">Nincs elérhető jegy</td>
                        </tr>`;
    return;
  }
  let data = await fetchGrades(studentId, subjectId);
  studentGrades = [];

  if (data.length <= 1 && data[0].gradeValue == -1) {
    tableBody.innerHTML = `<tr class="no-hover">
                        <td colspan="4" class="text-center">Nincs elérhető jegy</td>
                    </tr>`;
  } else {
    tableBody.innerHTML = "";

    data.forEach((grade) => {
      if (grade.gradeValue == -1) {
        return;
      }
      studentGrades.push(grade.gradeValue);
      const row = document.createElement("tr");
      row.classList.add("no-hover");
      row.id = grade.id;

      const valueCell = document.createElement("td");
      const gradeSpan = document.createElement("span");
      gradeSpan.id = `${grade.id}-grade`;
      gradeSpan.innerHTML = grade.gradeValue;
      gradeSpan.classList.add("grade-style");
      valueCell.appendChild(gradeSpan);
      row.appendChild(valueCell);

      const commentCell = document.createElement("td");
      commentCell.textContent = grade.comment.trim().length === 0 ? "Nincs megjegyzés" : `${grade.comment}`;
      row.appendChild(commentCell);

      const editButton = document.createElement("button");
      editButton.innerHTML = "Szerkesztés";
      editButton.classList.add("edit-button");
      editButton.onclick = function (event) {
        editGrade(event);
      };
      const editButtonCell = document.createElement("td");
      editButtonCell.appendChild(editButton);
      row.appendChild(editButtonCell);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Törlés";
      deleteButton.classList.add("delete-button");
      deleteButton.onclick = function (event) {
        deleteGrade(event);
      };
      const deleteButtonCell = document.createElement("td");
      deleteButtonCell.appendChild(deleteButton);
      row.appendChild(deleteButtonCell);

      tableBody.appendChild(row);
      gradeSpan.style.backgroundColor = getGradientBackground(grade.gradeValue);
    });
  }
}
async function showStatistics(studentId, subjectId) {
  await fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/statistics`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("average").textContent = data.average ?? "-";
      document.getElementById("median").textContent = data.median ?? "-";
      document.getElementById("mode").textContent = data.mode ?? "-";
      document.getElementById("average-card").style.backgroundColor = getGradientBackground(data.average);
      document.getElementById("median-card").style.backgroundColor = getGradientBackground(data.median);
      document.getElementById("mode-card").style.backgroundColor = getGradientBackground(data.mode);

      const distribution = data.distribution;
      const differences = data.difference;
      //histogram
      updateHistogram(distribution);
      //Linechart

      // [2, 1, 1]
      //console.log(differences);
      //console.log(studentGrades);

      drawLineChart(studentGrades, differences);
    })
    .catch((error) => {
      studentGrades = [];
      drawLineChart([1], []);
      generateHistogram();
      document.getElementById("average").textContent = "-";
      document.getElementById("median").textContent = "-";
      document.getElementById("mode").textContent = "-";
      document.getElementById("average-card").style.backgroundColor = "white";
      document.getElementById("median-card").style.backgroundColor = "white";
      document.getElementById("mode-card").style.backgroundColor = "white";
      //console.log("Grades:", grades);
      //console.log("Differences:", data.difference);
    });

  // Adatok betöltése az API-ból
}
async function addGrade() {
  const gradeValue = document.querySelector('#gradeRadiosContainer input[name="grade"]:checked').value;

  const comment = document.getElementById("commentInput");
  const newGrade = {
    studentId: selectedStudentId,
    subjectId: selectedSubjectId,
    gradeValue: gradeValue,
    comment: comment.value,
  };
  comment.value = "";
  console.log("dfasfasdf");
  if (selectedStudentId && selectedSubjectId) {
    await addGradeApi(newGrade);
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  }
}
async function deleteGrade(e) {
  const gradeId = e.target.closest("tr").id;
  await deleteGradeApi(gradeId);
  await showGrades(selectedStudentId, selectedSubjectId);
  await showStatistics(selectedStudentId, selectedSubjectId);
}
async function editGrade(e) {
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
