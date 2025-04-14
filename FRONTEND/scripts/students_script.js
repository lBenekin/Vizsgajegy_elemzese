let students = [];
fetch("http://localhost:5196/api/students")
  .then((response) => response.json())
  .then((data) => {
    students = data;
    const table = document.getElementById("studentsTable");
    let tableBody = table.querySelector("tbody");
    tableBody.innerHTML = "";

    data.forEach((student) => {
      const row = document.createElement("tr");
      row.id = student.id;
      const nameCell = document.createElement("td");
      nameCell.textContent = `${student.firstName} ${student.lastName}`;
      row.appendChild(nameCell);

      const dobCell = document.createElement("td");
      dobCell.textContent = new Date(student.dateOfBirth).toLocaleDateString();
      row.appendChild(dobCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = student.email;
      row.appendChild(emailCell);

      const subjectsCell = document.createElement("td");

      // Lekérjük az adott diák tantárgyait
      fetch(`http://localhost:5196/api/students/${student.id}/subjects`)
        .then((subjectResponse) => subjectResponse.json())
        .then((subjects) => {
          if (subjects && subjects.length > 0) {
            // A tantárgyak neveinek összefűzése
            const subjectsText = subjects.map((subject) => subject.subject.name).join(", ");
            subjectsCell.textContent = subjectsText;
          } else {
            subjectsCell.textContent = "Nincs tantárgy";
          }
        })
        .catch((error) => {
          console.error("Hiba történt a tantárgyak betöltésekor:", error);
          subjectsCell.textContent = "Hiba a tantárgyak betöltésében";
        });

      row.appendChild(subjectsCell);
      tableBody.appendChild(row);

      row.addEventListener("click", function (e) {
        // A kattintott sor adatainak kinyerése
        const clickedRow = e.currentTarget;

        // Adatok kinyerése a sorból (dataset használata)

        const selectedStudent = students.find((student) => student.id == row.id);

        // A form mezők értékeinek beállítása
        document.querySelector('input[placeholder="Név"]').value = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
        document.querySelector('input[type="date"]').value = new Date(selectedStudent.dateOfBirth).toISOString().split("T")[0]; // Formátum: yyyy-mm-dd
        document.querySelector('input[type="email"]').value = selectedStudent.email;
        rightDiv = document.getElementById("right");
        rightDiv.innerHTML = "";
        selectedStudent.subjects.forEach((subject) => {
          subjectElement = document.createElement("div");
          subjectElement.classList.add("list");
          subjectElement.draggable = true;
          subjectElement.id = subject.id;
          subjectElement.innerHTML = subject.name;
          rightDiv.appendChild(subjectElement);
        });
        updateSubjectEditor();
      });
    });
  });

function updateSubjectEditor() {
  let lists = document.getElementsByClassName("list");
  let rightBox = document.getElementById("right");
  let lefttBox = document.getElementById("left");

  for (item of lists) {
    item.addEventListener("dragstart", function (e) {
      let selected = e.target;
      rightBox.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      rightBox.addEventListener("drop", function (e) {
        rightBox.appendChild(selected);
        selected = null;
      });

      lefttBox.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      lefttBox.addEventListener("drop", function (e) {
        lefttBox.appendChild(selected);
        selected = null;
      });
    });
  }
}
