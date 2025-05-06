const BASE_URL = "http://localhost:5196/api/students";

export async function getStudents() {
  const response = await fetch(BASE_URL);
  return await response.json();
}

export async function updateStudent(id, student) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
}

export async function updateStudentSubjects(id, subjectIds) {
  return fetch(`${BASE_URL}/${id}/subjects`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subjectIds),
  });
}

export async function deleteStudent(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export async function addStudent(student) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
}
