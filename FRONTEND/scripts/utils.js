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
export function getGradientBackground(value) {
  return value < 3 ? `rgb(255,${(value - 1) * 127.5}, 0)` : `rgb(${255 - (value - 3) * 127.5}, 255, 0)`;
}
