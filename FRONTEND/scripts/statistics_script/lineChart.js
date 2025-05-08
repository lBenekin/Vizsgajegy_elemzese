export function drawLineChart(grades, differences) {
  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");
  const padding = 50;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width - 2 * padding;
  const height = canvas.height - 2 * padding;
  const maxDiff = Math.max(...differences, 1);
  const stepX = grades.length > 1 ? width / (grades.length - 1) : width;
  const stepY = height / maxDiff;

  function getCoords(index, value) {
    return {
      x: padding + index * stepX,
      y: canvas.height - padding - value * stepY,
    };
  }

  function drawAxes() {
    ctx.font = "18px Arial";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    ctx.textAlign = "center";
    grades.forEach((grade, i) => {
      const { x, y } = getCoords(i - 1, 0);
      if (i > 0) {
        ctx.fillText(grade, x, y + 20);
        console.log(i);
      }
    });

    ctx.textAlign = "right";
    for (let i = 0; i <= maxDiff; i++) {
      const { x, y } = getCoords(0, i);
      ctx.fillText(i, x - 5, y + 5);
    }
  }

  function drawLine() {
    ctx.beginPath();
    ctx.strokeStyle = "#B22222";
    ctx.lineWidth = 2;
    differences.forEach((diff, i) => {
      const { x, y } = getCoords(i, diff);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  if (!differences || differences.length === 0) {
    drawAxes();
    return;
  }

  drawAxes();
  drawLine();
}
