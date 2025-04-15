let subjects = [];
fetch("http://localhost:5196/api/subjects")
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

        // A form mezők értékeinek beállítása
        document.getElementById("name-editInput").value = selectedsubject.name;
        document.getElementById("code-editInput").value = selectedsubject.code; // Formátum: yyyy-mm-dd
        document.getElementById("description-editInput").value = selectedsubject.description;
      });
    });
  });
