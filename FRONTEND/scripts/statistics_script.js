let selectedGrade = null;
let selectedStudentId = null;
let selectedSubjectId = null;
document.addEventListener("DOMContentLoaded", () => {
  const studentsSelector = document.getElementById("studentsSelector");
  const subjectsSelector = document.getElementById("subjectsSelector");
  fetchStudents();
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
      showStatistics(selectedStudentId, selectedSubjectId);
      showGrades(selectedStudentId, selectedSubjectId);
    } else {
      clearSubjects(); // Ha nincs kiválasztott diák, töröljük a tárgyakat
    }
  });
});
function fetchStudents() {
  fetch("http://localhost:5196/api/students")
    .then((response) => response.json())
    .then((data) => {
      //studentsSelector = document.getElementById("studentsSelector");
      data.forEach((student) => {
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name;
        studentsSelector.appendChild(option);
      });
    });
}
function fetchSubjectsForStudent(studentId) {
  subjectsSelector = document.getElementById("subjectsSelector");
  subjectsSelector.innerHTML = "";
  fetch(`http://localhost:5196/api/students/${studentId}/subjects`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) return;

      data.forEach((subject, index) => {
        const option = document.createElement("option");
        option.value = subject.id;
        option.textContent = `${subject.name}`;
        if (index === 0) option.selected = true; // első kiválasztása
        subjectsSelector.appendChild(option);
      });

      // automatikusan meghívjuk a stat/jegyek lekérőt az első tárgyra
      selectedSubjectId = subjectsSelector.value;
      showStatistics(studentId, selectedSubjectId);
      showGrades(studentId, selectedSubjectId);
    });
}

function showGrades(studentId, subjectId) {
  fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/grades`)
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("gradesTable");
      let tableBody = table.querySelector("tbody");
      tableBody.innerHTML = "";

      if (data.length == 1 && data[0].gradeValue == -1) {
        const row = document.createElement("tr");
        const noValueCell = document.createElement("td");
        noValueCell.innerHTML = "Nincs elérhető jegy";
        noValueCell.colSpan = 4;
        noValueCell.classList.add("text-center");
        row.appendChild(noValueCell);
        tableBody.appendChild(row);
      }

      data.forEach((grade) => {
        if (grade.gradeValue == -1) {
          return;
        }
        const row = document.createElement("tr");
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
    });
}
function getGradientBackground(value) {
  if (value < 3) {
    return `rgb(255,${(value - 1) * 127.5} , 0)`;
  } else {
    return `rgb(${255 - (value - 3) * 127.5}, 255, 0)`;
  }
}
function showStatistics(studentId, subjectId) {
  fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/statistics`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("average").textContent = data.average ?? "-";
      document.getElementById("median").textContent = data.median ?? "-";
      document.getElementById("mode").textContent = data.mode ?? "-";
      document.getElementById("average-card").style.backgroundColor = getGradientBackground(data.average);
      document.getElementById("median-card").style.backgroundColor = getGradientBackground(data.median);
      document.getElementById("mode-card").style.backgroundColor = getGradientBackground(data.mode);

      //histogram
      const rawMaxY = Math.max(...Object.values(data.distribution));

      // Lépésköz meghatározása (pl. 2, 5, 10)
      const step = Math.ceil(rawMaxY / 5); // mindig felfelé, hogy biztos elférjen

      // Skála felső határa
      const maxY = step * 5; // mindig öttel osztható érték

      // Töröljük az előző vonalakat
      const wrapper = document.querySelector(".histogram-wrapper");
      const yAxis = document.querySelector(".y-axis");
      const histogram = document.getElementById("histogram");

      yAxis.innerHTML = "";
      histogram.innerHTML = "";

      const numLines = 6;
      for (let i = 0; i < numLines; i++) {
        const ratio = i / (numLines - 1);
        const value = i * step;

        // Grid line
        const line = document.createElement("div");
        line.className = "grid-line";
        line.style.bottom = `${ratio * 100}%`;
        histogram.appendChild(line);

        // Label
        const label = document.createElement("div");
        label.className = "y-axis-label";
        label.style.bottom = `${ratio * 100}%`;
        label.textContent = value;
        yAxis.appendChild(label);
      }

      // Sávok kirajzolása
      if (data.distribution && Object.keys(data.distribution).length > 0) {
        Object.entries(data.distribution).forEach(([grade, count]) => {
          const bar = document.createElement("div");
          bar.className = "bar";
          bar.style.height = (count / maxY) * 100 + "%";
          bar.textContent = grade;

          if (count == 0) {
            bar.style.height = "30px";
            bar.style.backgroundColor = "rgba(255, 255, 255, 0)";
          }

          histogram.appendChild(bar);
        });
      } else {
        histogram.innerHTML = "<p>Nincs elérhető adat.</p>";
      }
    })
    .catch((error) => {
      console.error("API hiba:", error);
      document.getElementById("histogram").innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
      document.getElementById("lineChart").innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
    });

  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");

  // Adatok betöltése az API-ból
  fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/statistics`) // Cseréld le a megfelelő API URL-re
    .then((response) => response.json())
    .then((data) => {
      const differences = data.difference; // [2, 1, 1]
      const grades = [2, 3, 4, 5]; // Az osztályzatok skálája
      drawLineChart(grades, differences);
    })
    .catch((error) => console.error("Hiba történt az API hívás során:", error));

  function drawLineChart(grades, differences) {
    if (!differences || differences.length === 0) {
      console.warn("Nincs elérhető 'difference' adat.");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // ← Tisztítás
    const padding = 50;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxDiff = Math.max(...differences, 1); // minimum 1

    const stepX = width / (grades.length - 1);
    const stepY = height / maxDiff;

    function getCanvasCoords(index, value) {
      const x = padding + index * stepX;
      const y = canvas.height - padding - value * stepY;
      return { x, y };
    }

    function drawAxes() {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();

      ctx.textAlign = "center";
      grades.forEach((grade, i) => {
        const { x, y } = getCanvasCoords(i, 0);
        ctx.fillText(grade, x, y + 20);
      });

      ctx.textAlign = "right";
      for (let i = 0; i <= maxDiff; i++) {
        const { x, y } = getCanvasCoords(0, i);
        ctx.fillText(i, x - 10, y + 5);
      }
    }

    function drawChartLine() {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;

      differences.forEach((diff, i) => {
        const { x, y } = getCanvasCoords(i, diff);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    drawAxes();
    drawChartLine();
  }
}
async function addGrade() {
  const gradeValue = document.querySelector('#gradeRadiosContainer input[name="grade"]:checked').value;
  console.log(gradeValue);
  const comment = document.getElementById("commentInput").value;
  const newGrade = {
    studentId: selectedStudentId,
    subjectId: selectedSubjectId,
    gradeValue: gradeValue,
    comment: comment,
  };
  console.log(JSON.stringify(newGrade));

  await fetch("http://localhost:5196/api/grades/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGrade),
  });
  showGrades(selectedStudentId, selectedSubjectId);
  showStatistics(selectedStudentId, selectedSubjectId);
}
async function deleteGrade(e) {
  const gradeId = e.target.closest("tr").id;
  await fetch("http://localhost:5196/api/grades/" + gradeId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: null,
  });
  showGrades(selectedStudentId, selectedSubjectId);
  showStatistics(selectedStudentId, selectedSubjectId);
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
  comment = commentCell.innerHTML;
  commentCell.innerHTML = "";
  const commentTextArea = document.createElement("textarea");
  commentTextArea.classList.add("comment-input-style");
  commentTextArea.style.maxWidth = "200px";
  commentTextArea.style.margin = "0px";
  commentTextArea.placeholder = "Írd ide a megjegyzést!";
  commentTextArea.value = comment;
  commentCell.appendChild(commentTextArea);

  saveButton.onclick = async function () {
    const updatedGrade = {
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      gradeValue: gradeSelector.value,
      comment: commentTextArea.value,
    };

    await fetch("http://localhost:5196/api/grades/" + gradeId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGrade),
    });
    await showGrades(selectedStudentId, selectedSubjectId);
    await showStatistics(selectedStudentId, selectedSubjectId);
  };
}
/*document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");

  // Adatok betöltése az API-ból
  fetch("http://localhost:5196/api/students/1/2/statistics") // Cseréld le a megfelelő API URL-re
    .then((response) => response.json())
    .then((data) => {
      const differences = data.difference; // [2, 1, 1]
      const grades = [2, 3, 4, 5]; // Az osztályzatok skálája
      drawLineChart(grades, differences);
    })
    .catch((error) => console.error("Hiba történt az API hívás során:", error));

  function drawLineChart(grades, differences) {
    // Vászon mérete és beállítások
    const padding = 50;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    // Y tengely normalizálása (a különbségek maximuma alapján)
    const maxDiff = Math.max(...differences);
    const stepX = width / (grades.length - 1);
    const stepY = height / maxDiff;

    // Koordináták átalakítása
    function getCanvasCoords(index, value) {
      const x = padding + index * stepX;
      const y = canvas.height - padding - value * stepY;
      return { x, y };
    }

    // Tengelyek rajzolása
    function drawAxes() {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();

      // X tengely (osztályzatok)
      ctx.textAlign = "center";
      grades.forEach((grade, i) => {
        const { x, y } = getCanvasCoords(i, 0);
        ctx.fillText(grade, x, y + 20);
      });

      // Y tengely (különbségek)
      ctx.textAlign = "right";
      for (let i = 0; i <= maxDiff; i++) {
        const { x, y } = getCanvasCoords(0, i);
        ctx.fillText(i, x - 10, y + 5);
      }
    }

    // Vonaldiagram rajzolása
    function drawChartLine() {
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;

      differences.forEach((diff, i) => {
        const { x, y } = getCanvasCoords(i, diff);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    drawAxes();
    drawChartLine();
  }
});*/
