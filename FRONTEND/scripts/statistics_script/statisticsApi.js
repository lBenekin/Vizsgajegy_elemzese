export async function fetchStudents() {
  const response = await fetch("http://localhost:5196/api/students");
  return await response.json();
}

export async function fetchSubjectsForStudent(studentId) {
  const response = await fetch(`http://localhost:5196/api/students/${studentId}/subjects`);
  return await response.json();
}

export async function fetchGrades(studentId, subjectId) {
  const response = await fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/grades`);
  return await response.json();
}

export async function fetchStatistics(studentId, subjectId) {
  const response = await fetch(`http://localhost:5196/api/students/${studentId}/${subjectId}/statistics`);
  return await response.json();
}

export async function addGradeApi(grade) {
  await fetch("http://localhost:5196/api/grades/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grade),
  });
}

export async function deleteGradeApi(gradeId) {
  await fetch("http://localhost:5196/api/grades/" + gradeId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export async function editGradeApi(gradeId, updatedGrade) {
  await fetch("http://localhost:5196/api/grades/" + gradeId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedGrade),
  });
}
