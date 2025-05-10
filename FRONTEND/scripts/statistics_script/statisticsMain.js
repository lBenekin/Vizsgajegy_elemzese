import { fetchStudents as fetchStudentsApi, fetchSubjectsForStudent as fetchSubjectsForStudentApi } from "./statisticsApi.js";
import { generateHistogram } from "./histogram.js";
import { drawLineChart } from "./lineChart.js";
import { setSelectionForGradeAction } from "./gradeActions.js";
import { showGrades, showStatistics } from "./gradeDisplay.js";
import { addGrade } from "./gradeActions.js";

let selectedStudentId = null;
let selectedSubjectId = null;

document.addEventListener("DOMContentLoaded", () => {
  const studentsSelector = document.getElementById("studentsSelector");
  const subjectsSelector = document.getElementById("subjectsSelector");
  fetchStudents();
  generateHistogram();
  drawLineChart([0], []);
  const addGradeButton = document.getElementById("addGradeButton");
  addGradeButton.onclick = function () {
    addGrade();
  };

  studentsSelector.addEventListener("change", function () {
    selectedStudentId = this.value;
    if (selectedStudentId) {
      fetchSubjectsForStudent(selectedStudentId);
    }
  });
  subjectsSelector.addEventListener("change", function () {
    selectedStudentId = studentsSelector.value;
    selectedSubjectId = this.value;

    setSelectionForGradeAction(selectedStudentId, selectedSubjectId);
    if (selectedSubjectId) {
      (async () => {
        await showGrades(selectedStudentId, selectedSubjectId);
        await showStatistics(selectedStudentId, selectedSubjectId);
      })();
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
    if (index === 0) option.selected = true; // Select the first one
    subjectsSelector.appendChild(option);
  });
  selectedSubjectId = subjectsSelector.value;
  setSelectionForGradeAction(studentId, selectedSubjectId);
  (async () => {
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  })();
}
