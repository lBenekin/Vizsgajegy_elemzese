fetch("http://localhost:5196/api/students")
  .then((response) => response.json())
  .then((data) => {
    const table = document.getElementById("studentsTable");
    let tableBody = table.querySelector("tbody");
    tableBody.innerHTML = "";

    data.forEach((student) => {
      const row = document.createElement("tr");

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
    });
  });
