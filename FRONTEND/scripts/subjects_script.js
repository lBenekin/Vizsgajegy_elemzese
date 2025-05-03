let subjects = [];
let selectedSubject = null;
loadSubjects();
async function loadSubjects() {
  await fetch("http://localhost:5196/api/subjects")
    .then((response) => response.json())
    .then((data) => {
      subjects = data;
      const table = document.getElementById("subjectsTable");
      table.classList.remove("no-hover");
      let tableBody = table.querySelector("tbody");
      tableBody.innerHTML = "";

      if (data.length == 0) {
        const row = document.createElement("tr");
        const noValueCell = document.createElement("td");
        noValueCell.innerHTML = "Nincs elérhető tantárgy";
        noValueCell.colSpan = 4;
        noValueCell.classList.add("text-center");
        table.classList.add("no-hover");
        row.appendChild(noValueCell);
        tableBody.appendChild(row);
      }

      data.forEach((subject) => {
        const row = document.createElement("tr");
        row.id = subject.id;
        const nameCell = document.createElement("td");
        nameCell.textContent = `${subject.name}`;
        row.appendChild(nameCell);

        const dobCell = document.createElement("td");
        dobCell.textContent = subject.code;
        row.appendChild(dobCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = subject.description;
        row.appendChild(emailCell);
        tableBody.appendChild(row);

        row.addEventListener("click", function (e) {
          // A kattintott sor adatainak kinyerése
          const clickedRow = e.currentTarget;
          // Adatok kinyerése a sorból (dataset használata)
          document.querySelectorAll("#subjectsTable tbody tr").forEach((r) => {
            r.classList.remove("active-row");
          });

          clickedRow.classList.add("active-row");

          document.querySelectorAll("#subjectsTable tbody tr").forEach((r) => {
            r.classList.remove("active-row");
          });

          clickedRow.classList.add("active-row");
          selectedSubject = subjects.find((subject) => subject.id == row.id);
          // A form mezők értékeinek beállítása
          document.getElementById("nameBox").value = selectedSubject.name;
          document.getElementById("codeBox").value = selectedSubject.code; // Formátum: yyyy-mm-dd
          document.getElementById("descriptionBox").value = selectedSubject.description;
        });
      });
    });
}
async function addSubject() {
  const name = document.getElementById("addNameBox").value;
  const code = document.getElementById("addCodeBox").value;
  const desc = document.getElementById("addDescriptionBox").value;
  const newSubject = {
    name: name,
    code: code,
    description: desc,
  };
  console.log(JSON.stringify(newSubject));

  await fetch("http://localhost:5196/api/subjects/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSubject),
  });
  loadSubjects();
  clearInputs();
}
async function deleteSubject() {
  if (selectedSubject == null) {
    alert("Nem választottál ki tantárgyat!");
    return;
  }
  const confirmation = confirm(`Biztosan törölni szeretnéd? (${selectedSubject.name})`);

  if (confirmation) {
    await fetch("http://localhost:5196/api/subjects/" + selectedSubject.id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: null,
    });
    loadSubjects();
    clearInputs();
  }
}
async function saveSubject() {
  if (selectedSubject == null) {
    alert("Nem választottál ki tantárgyat!");
    return;
  }
  const name = document.getElementById("nameBox").value;
  const code = document.getElementById("codeBox").value;
  const desc = document.getElementById("descriptionBox").value;
  const updatedSubject = {
    name: name,
    code: code,
    description: desc,
  };
  console.log(updatedSubject);
  await fetch("http://localhost:5196/api/subjects/" + selectedSubject.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSubject),
  });
  loadSubjects();
  clearInputs();
}
function clearInputs() {
  const inputs = document.getElementsByTagName("input");
  Array.from(inputs).forEach((input) => {
    input.value = "";
  });
  selectedSubject = null;
}
