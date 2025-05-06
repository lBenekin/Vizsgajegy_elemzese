import { getSubjects } from "./subjectApi.js";

export let subjects = [];
export let selectedSubject = null;

export async function loadSubjects() {
  const data = await getSubjects();
  subjects = data;

  const table = document.getElementById("subjectsTable");
  const tbody = table.querySelector("tbody");
  table.classList.remove("no-hover");
  tbody.innerHTML = "";

  if (subjects.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "text-center";
    cell.textContent = "Nincs elérhető tantárgy";
    row.appendChild(cell);
    table.classList.add("no-hover");
    tbody.appendChild(row);
    return;
  }

  subjects.forEach((subject) => {
    const row = document.createElement("tr");
    row.id = subject.id;

    row.innerHTML = `
      <td>${subject.name}</td>
      <td>${subject.code}</td>
      <td>${subject.description}</td>
    `;

    row.addEventListener("click", () => {
      document.querySelectorAll("#subjectsTable tbody tr").forEach((r) => r.classList.remove("active-row"));
      row.classList.add("active-row");
      selectedSubject = subject;
      populateForm(subject);
    });

    tbody.appendChild(row);
  });
}

function populateForm(subject) {
  document.getElementById("nameBox").value = subject.name;
  document.getElementById("codeBox").value = subject.code;
  document.getElementById("descriptionBox").value = subject.description;
}

export function clearInputs() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  selectedSubject = null;
}
