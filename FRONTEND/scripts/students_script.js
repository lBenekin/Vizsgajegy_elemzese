let students = [];
let selectedStudent = null;
loadStudents();

async function updateSubjectEditor() {
  let lists = document.getElementsByClassName("list");
  let rightBox = document.getElementById("right");
  let leftBox = document.getElementById("left");
  leftBox.innerHTML = "";
  await fetch(`http://localhost:5196/api/subjects`)
    .then((subjectResponse) => subjectResponse.json())
    .then((subjects) => {
      subjects.forEach((subject) => {
        if (selectedStudent == null || !selectedStudent.subjects.some((s) => s.id === subject.id)) {
          console.log(subject);
          subjectElement = document.createElement("div");
          subjectElement.classList.add("list");
          subjectElement.draggable = true;
          subjectElement.id = subject.id;
          subjectElement.innerHTML = subject.name;
          leftBox.appendChild(subjectElement);
        }
      });
    })
    .catch((error) => {
      console.error("Hiba történt a tantárgyak betöltésekor:", error);
      subjectsCell.textContent = "Hiba a tantárgyak betöltésében";
    });

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

      leftBox.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      leftBox.addEventListener("drop", function (e) {
        leftBox.appendChild(selected);
        selected = null;
      });
    });
  }
}
async function saveStudent() {
  if (selectedStudent == null) {
    alert("Nem választottál ki tanulót!");
    return;
  }
  const name = document.getElementById("nameBox").value;
  const email = document.getElementById("emailBox").value;
  const date = document.getElementById("dateBox").value;
  const updatedStudent = {
    name: name,
    email: email,
    dateOfBirth: date,
  };
  console.log(updatedStudent);
  await fetch("http://localhost:5196/api/students/" + selectedStudent.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStudent),
  });

  const rightDiv = document.getElementById("right");
  const studentSubjectIds = Array.from(rightDiv.children).map((subject) => parseInt(subject.id));
  console.log(JSON.stringify(studentSubjectIds));
  await fetch("http://localhost:5196/api/students/" + selectedStudent.id + "/subjects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentSubjectIds),
  });
  loadStudents();
  clearInputs();
}
async function deleteStudent() {
  if (selectedStudent == null) {
    alert("Nem választottál ki tanulót!");
    return;
  }
  const confirmation = confirm(`Biztosan törölni szeretnéd? (${selectedStudent.name})`);

  if (confirmation) {
    await fetch("http://localhost:5196/api/students/" + selectedStudent.id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: null,
    });
    loadStudents();
    clearInputs();
  }
}
async function loadStudents() {
  await fetch("http://localhost:5196/api/students")
    .then((response) => response.json())
    .then((data) => {
      students = data;
      const table = document.getElementById("studentsTable");
      table.classList.remove("no-hover");
      let tableBody = table.querySelector("tbody");
      tableBody.innerHTML = "";

      if (data.length == 0) {
        const row = document.createElement("tr");
        const noValueCell = document.createElement("td");
        noValueCell.innerHTML = "Nincs elérhető tanuló";
        noValueCell.colSpan = 4;
        noValueCell.classList.add("text-center");
        table.classList.add("no-hover");
        row.appendChild(noValueCell);
        tableBody.appendChild(row);
      }

      data.forEach((student) => {
        const row = document.createElement("tr");
        row.id = student.id;
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;
        row.appendChild(nameCell);

        const dobCell = document.createElement("td");
        dobCell.textContent = new Date(student.dateOfBirth).toLocaleDateString();
        row.appendChild(dobCell);

        const emailCell = document.createElement("td");
        emailCell.textContent = student.email;
        row.appendChild(emailCell);

        const subjectsCell = document.createElement("td");
        if (student.subjects.length === 0) {
          subjectsCell.textContent = "Még nincs tárgya";
          subjectsCell.style.color = "red";
        } else {
          subjectsCell.textContent = student.subjects.map((subject) => subject.name).join(", ");
          subjectsCell.style.color = "black";
        }

        row.appendChild(subjectsCell);
        tableBody.appendChild(row);

        row.addEventListener("click", function (e) {
          // A kattintott sor adatainak kinyerése
          const clickedRow = e.currentTarget;
          // Adatok kinyerése a sorból (dataset használata)
          document.querySelectorAll("#studentsTable tbody tr").forEach((r) => {
            r.classList.remove("active-row");
          });

          clickedRow.classList.add("active-row");
          selectedStudent = students.find((student) => student.id == row.id);
          // A form mezők értékeinek beállítása
          document.getElementById("nameBox").value = selectedStudent.name;
          document.getElementById("emailBox").value = selectedStudent.email;
          document.getElementById("dateBox").value = new Date(selectedStudent.dateOfBirth).toISOString().split("T")[0]; // Formátum: yyyy-mm-dd
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
}
function clearInputs() {
  const inputs = document.getElementsByTagName("input");
  Array.from(inputs).forEach((input) => {
    input.value = "";
  });
  rightDiv = document.getElementById("right");
  rightDiv.innerHTML = "";
  leftDiv = document.getElementById("left");
  leftDiv.innerHTML = "";
  selectedStudent = null;
}
async function addStudent() {
  const name = document.getElementById("addNameBox").value;
  const date = document.getElementById("addDateBox").value;
  const email = document.getElementById("addEmailBox").value;
  const newStudent = {
    name: name,
    dateOfBirth: date,
    email: email,
  };
  console.log(JSON.stringify(newStudent));

  await fetch("http://localhost:5196/api/students/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  });
  loadStudents();
}
