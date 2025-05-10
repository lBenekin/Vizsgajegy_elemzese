export function generateHistogram() {
  const histogram = document.getElementById("histogram");
  const yAxis = document.querySelector(".y-axis");
  const xAxis = document.getElementById("xAxis");

  histogram.innerHTML = "";
  yAxis.innerHTML = "";
  xAxis.innerHTML = "";

  //Generate lines in the background
  const numLines = 6;
  for (let i = 0; i < numLines; i++) {
    const ratio = i / (numLines - 1);
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.bottom = `${ratio * 100}%`;
    histogram.appendChild(line);

    const label = document.createElement("span");
    label.className = "y-axis-label";
    label.style.bottom = `${ratio * 100}%`;
    label.textContent = i;
    yAxis.appendChild(label);
  }

  //Generate x axis labels and the bars
  for (let i = 1; i <= 5; i++) {
    const bar = document.createElement("div");
    bar.id = `gradeBar${i}`;
    bar.className = "bar";
    bar.style.height = "0%";

    const label = document.createElement("span");
    label.id = `gradeLabel${i}`;
    bar.appendChild(label);

    histogram.appendChild(bar);

    const xLabel = document.createElement("div");
    xLabel.className = "x-axis-label";
    xLabel.textContent = i;
    xAxis.appendChild(xLabel);
  }
}
export function updateHistogram(distribution) {
  if (distribution == null) {
    generateHistogram();
  } else {
    const rawMaxY = Math.max(...Object.values(distribution));

    const step = Math.ceil(rawMaxY / 5);
    //5 is the top border

    const maxY = step * 5;

    // Delete and regenerate the lines in the background
    const yAxis = document.querySelector(".y-axis");

    yAxis.innerHTML = "";

    const numLines = 6;
    for (let i = 0; i < numLines; i++) {
      const ratio = i / (numLines - 1);
      const value = i * step;
      const yLabel = document.createElement("span");
      yLabel.className = "y-axis-label";
      yLabel.style.bottom = `${ratio * 100}%`;
      yLabel.textContent = value;
      yAxis.appendChild(yLabel);
    }

    // Draw Bars
    Object.entries(distribution).forEach(([grade, count]) => {
      const existingGradeBar = document.getElementById(`gradeBar${grade}`);
      const existingGradeLabel = document.getElementById(`gradeLabel${grade}`);

      if (existingGradeBar) {
        existingGradeLabel.innerHTML = count;
        existingGradeLabel.className = "";
        if ((count / maxY) * 100 <= 14) {
          existingGradeLabel.className = "bar-label";
        }
        requestAnimationFrame(() => {
          existingGradeBar.style.height = (count / maxY) * 100 + "%";
        });
      }
    });
  }
}
