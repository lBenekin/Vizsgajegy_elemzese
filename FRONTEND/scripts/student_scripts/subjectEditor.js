import { selectedStudent } from "./studentDom.js";

export async function updateSubjectEditor() {
  let lists = document.getElementsByClassName("list");
  let rightBox = document.getElementById("right");
  let leftBox = document.getElementById("left");
  leftBox.innerHTML = "";

  try {
    const response = await fetch("http://localhost:5196/api/subjects");
    const subjects = await response.json();

    subjects.forEach((subject) => {
      if (selectedStudent == null || !selectedStudent.subjects.some((s) => s.id === subject.id)) {
        console.log(subject);
        let subjectElement = document.createElement("div");
        subjectElement.classList.add("list");
        subjectElement.draggable = true;
        subjectElement.id = subject.id;
        subjectElement.innerHTML = subject.name;
        leftBox.appendChild(subjectElement);
      }
    });
  } catch (error) {
    console.error("Tantárgyak betöltése sikertelen:", error);
  }
  for (let item of lists) {
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
