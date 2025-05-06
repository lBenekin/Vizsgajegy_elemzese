import { loadSubjects, clearInputs, selectedSubject } from "./subjectDom.js";
import { addSubject, deleteSubject, updateSubject } from "./subjectApi.js";
import { hasEmpty } from "../utils.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();

  document.getElementById("addSubjectButton").addEventListener("click", async () => {
    const name = document.getElementById("addNameBox").value;
    const code = document.getElementById("addCodeBox").value;
    const desc = document.getElementById("addDescriptionBox").value;
    if (!hasEmpty(name, code, desc)) {
      console.log("add");

      const newSubject = { name, code, description: desc };
      await addSubject(newSubject);
      await loadSubjects();
      clearInputs();
    }
  });

  document.getElementById("save-button").addEventListener("click", async () => {
    if (!selectedSubject) return alert("Nem választottál ki tantárgyat!");
    const name = document.getElementById("nameBox").value;
    const code = document.getElementById("codeBox").value;
    const desc = document.getElementById("descriptionBox").value;
    if (!hasEmpty(name, code, desc)) {
      const updatedSubject = {
        name: name,
        code: code,
        description: desc,
      };

      await updateSubject(selectedSubject.id, updatedSubject);
      await loadSubjects();
      clearInputs();
    }
  });

  document.getElementById("delete-button").addEventListener("click", async () => {
    if (!selectedSubject) return alert("Nem választottál ki tantárgyat!");
    if (!confirm(`Biztosan törölni szeretnéd? (${selectedSubject.name})`)) return;

    await deleteSubject(selectedSubject.id);
    await loadSubjects();
    clearInputs();
  });
});
