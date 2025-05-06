export function clearInputs() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  document.getElementById("left").innerHTML = "";
  document.getElementById("right").innerHTML = "";
}
export function hasEmpty(...strings) {
  for (let item of strings) {
    if (item.trim().length === 0) {
      return true;
    }
  }
  return false;
}
