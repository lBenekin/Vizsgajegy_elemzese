import { fetchGrades, fetchStatistics } from "./statisticsApi.js";
import { getGradientBackground } from "../utils.js";
import { generateHistogram, updateHistogram } from "./histogram.js";
import { drawLineChart } from "./lineChart.js";
import { deleteGrade, editGrade } from "./gradeActions.js";
let studentGrades = [];
export async function showGrades(studentId, subjectId) {
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

export async function showStatistics(studentId, subjectId) {
  let data = await fetchStatistics(studentId, subjectId).catch((error) => {
    studentGrades = [];
    drawLineChart([1], []);
    generateHistogram();
    document.getElementById("average").textContent = "-";
    document.getElementById("median").textContent = "-";
    document.getElementById("mode").textContent = "-";
    document.getElementById("average-card").style.backgroundColor = "white";
    document.getElementById("median-card").style.backgroundColor = "white";
    document.getElementById("mode-card").style.backgroundColor = "white";
  });
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
  drawLineChart(studentGrades, differences);
}
