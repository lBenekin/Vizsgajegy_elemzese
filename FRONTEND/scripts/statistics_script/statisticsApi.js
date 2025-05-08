const BASE_STUDENTS_URL = "http://localhost:5196/api/students/";
const BASE_GRADES_URL = "http://localhost:5196/api/grades/";

export async function fetchStudents() {
  const response = await fetch(BASE_STUDENTS_URL);
  return await response.json();
}

export async function fetchSubjectsForStudent(studentId) {
  const response = await fetch(`${BASE_STUDENTS_URL}${studentId}/subjects`);
  return await response.json();
}

export async function fetchGrades(studentId, subjectId) {
  const response = await fetch(`${BASE_STUDENTS_URL}${studentId}/${subjectId}/grades`);
  return await response.json();
}

export async function fetchStatistics(studentId, subjectId) {
  const response = await fetch(`${BASE_STUDENTS_URL}${studentId}/${subjectId}/statistics`);
  return await response.json();
}

export async function addGradeApi(grade) {
  await fetch(BASE_GRADES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grade),
  });
}

export async function deleteGradeApi(gradeId) {
  await fetch(BASE_GRADES_URL + gradeId, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export async function editGradeApi(gradeId, updatedGrade) {
  await fetch(BASE_GRADES_URL + gradeId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedGrade),
  });
}
