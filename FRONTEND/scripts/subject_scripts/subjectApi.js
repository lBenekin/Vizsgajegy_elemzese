const BASE_URL = "http://localhost:5196/api/subjects";

export async function getSubjects() {
  const response = await fetch(BASE_URL);
  return await response.json();
}

export async function addSubject(subject) {
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
}

export async function updateSubject(id, subject) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subject),
  });
}

export async function deleteSubject(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
