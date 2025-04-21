let subjects = [];
let selectedSubject = null;
loadSubjects();
async function loadSubjects() {
  await fetch("http://localhost:5196/api/subjects")
    .then((response) => response.json())
    .then((data) => {
      subjects = data;
      const table = document.getElementById("subjectsTable");
      let tableBody = table.querySelector("tbody");
      tableBody.innerHTML = "";

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
          const selectedsubject = subjects.find((subject) => subject.id == row.id);

          document.querySelectorAll("#subjectsTable tbody tr").forEach((r) => {
            r.classList.remove("active-row");
          });

          clickedRow.classList.add("active-row");
          selectedSubject = subjects.find((subject) => subject.id == row.id);
          // A form mezők értékeinek beállítása
          document.getElementById("nameBox").value = selectedsubject.name;
          document.getElementById("codeBox").value = selectedsubject.code; // Formátum: yyyy-mm-dd
          document.getElementById("descriptionBox").value = selectedsubject.description;
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
    selectedSubject = null;
  }
}
async function saveSubject() {
  if (selectedSubject == null) {
    alert("Nem választottál ki tanulót!");
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
  selectedSubject = null;
}
function clearInputs() {
  const inputs = document.getElementsByTagName("input");
  Array.from(inputs).forEach((input) => {
    input.value = "";
  });
}
