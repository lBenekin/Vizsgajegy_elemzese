fetch('http://localhost:5196/api/students/1/statistics')
    .then(response => response.json())
    .then(data => {



        document.getElementById("average").textContent = data.average ?? '-';
        document.getElementById("median").textContent = data.median ?? '-';
        document.getElementById("mode").textContent = data.mode ?? '-';
        setCardBackground('average-card', data.average);
        setCardBackground('median-card', data.median);
        setCardBackground('mode-card', data.mode);


        //histogram
        const histogram = document.getElementById("histogram");
        histogram.innerHTML = "";
        if (data.distribution && Object.keys(data.distribution).length > 0) {
            Object.entries(data.distribution).forEach(([grade, count]) => {
                let bar = document.createElement("div");
                bar.className = "bar";
                bar.style.height = (count * 30) + "px";
                bar.textContent = grade;
                if(count == 0)
                {
                    bar.style.height = "30px";
                    bar.style.backgroundColor = "rgba(255, 255, 255, 0)"
                }

                histogram.appendChild(bar);
            });
        } else {
            histogram.innerHTML = "<p>Nincs elérhető adat.</p>";
        }

        
       
    })
    .catch(error => {
        console.error("API hiba:", error);
        document.getElementById("histogram").innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
        document.getElementById("lineChart").innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
    });

    function setCardBackground(cardId, value) {
        const card = document.getElementById(cardId);
        if(value<3)
        {
            card.style.backgroundColor = `rgb(255,${(value - 1) * 127.5} , 0)`;
        }
        else
        {
            card.style.backgroundColor = `rgb(${255 - (value - 3) * 127.5}, 255, 0)`;

        }
            
    }
    document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");

    // Adatok betöltése az API-ból
    fetch("http://localhost:5196/api/students/1/2/statistics") // Cseréld le a megfelelő API URL-re
        .then(response => response.json())
        .then(data => {
            const differences = data.difference; // [2, 1, 1]
            const grades = [2, 3, 4, 5]; // Az osztályzatok skálája
            drawLineChart(grades, differences);
        })
        .catch(error => console.error("Hiba történt az API hívás során:", error));

    function drawLineChart(grades, differences) {
        // Vászon mérete és beállítások
        const padding = 50;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        // Y tengely normalizálása (a különbségek maximuma alapján)
        const maxDiff = Math.max(...differences);
        const stepX = width / (grades.length - 1);
        const stepY = height / maxDiff;

        // Koordináták átalakítása
        function getCanvasCoords(index, value) {
            const x = padding + index * stepX;
            const y = canvas.height - padding - value * stepY;
            return { x, y };
        }

        // Tengelyek rajzolása
        function drawAxes() {
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.stroke();

            // X tengely (osztályzatok)
            ctx.textAlign = "center";
            grades.forEach((grade, i) => {
                const { x, y } = getCanvasCoords(i, 0);
                ctx.fillText(grade, x, y + 20);
            });

            // Y tengely (különbségek)
            ctx.textAlign = "right";
            for (let i = 0; i <= maxDiff; i++) {
                const { x, y } = getCanvasCoords(0, i);
                ctx.fillText(i, x - 10, y + 5);
            }
        }

        // Vonaldiagram rajzolása
        function drawChartLine() {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;

            differences.forEach((diff, i) => {
                const { x, y } = getCanvasCoords(i, diff);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();
        }

        drawAxes();
        drawChartLine();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");

    // Adatok betöltése az API-ból
    fetch("http://localhost:5196/api/students/1/2/statistics") // Cseréld le a megfelelő API URL-re
        .then(response => response.json())
        .then(data => {
            const differences = data.difference; // [2, 1, 1]
            const grades = [2, 3, 4, 5]; // Az osztályzatok skálája
            drawLineChart(grades, differences);
        })
        .catch(error => console.error("Hiba történt az API hívás során:", error));

    function drawLineChart(grades, differences) {
        // Vászon mérete és beállítások
        const padding = 50;
        const width = canvas.width - 2 * padding;
        const height = canvas.height - 2 * padding;

        // Y tengely normalizálása (a különbségek maximuma alapján)
        const maxDiff = Math.max(...differences);
        const stepX = width / (grades.length - 1);
        const stepY = height / maxDiff;

        // Koordináták átalakítása
        function getCanvasCoords(index, value) {
            const x = padding + index * stepX;
            const y = canvas.height - padding - value * stepY;
            return { x, y };
        }

        // Tengelyek rajzolása
        function drawAxes() {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, canvas.height - padding);
            ctx.lineTo(canvas.width - padding, canvas.height - padding);
            ctx.stroke();

            // X tengely (osztályzatok)
            ctx.textAlign = "center";
            grades.forEach((grade, i) => {
                const { x, y } = getCanvasCoords(i, 0);
                ctx.fillText(grade, x, y + 20);
            });

            // Y tengely (különbségek)
            ctx.textAlign = "right";
            for (let i = 0; i <= maxDiff; i++) {
                const { x, y } = getCanvasCoords(0, i);
                ctx.fillText(i, x - 10, y + 5);
            }
        }

        // Vonaldiagram rajzolása
        function drawChartLine() {
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;

            differences.forEach((diff, i) => {
                const { x, y } = getCanvasCoords(i, diff);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();
        }

        drawAxes();
        drawChartLine();
        
    }




    fetchStudents();
    document.getElementById("studentsSelector").addEventListener("change", function () {
        const selectedStudentId = this.value;
        if (selectedStudentId) {
            fetchSubjectsForStudent(selectedStudentId);
        } else {
            clearSubjects(); // Ha nincs kiválasztott diák, töröljük a tárgyakat
        }
    });
    function fetchStudents()
    {
        fetch('http://localhost:5196/api/students')
        .then(response => response.json())
        .then(data => {
            //studentsSelector = document.getElementById("studentsSelector");
            data.forEach(student => {
                const option = document.createElement("option");
                option.value = student.id;
                option.textContent = `${student.firstName} ${student.lastName}`;
                studentsSelector.appendChild(option);


            });
        });
    }

    function fetchSubjectsForStudent(studentId)
    {
        console.log(studentId);
        subjectsSelector = document.getElementById("subjectsSelector");
        subjectsSelector.innerHTML = "";
        fetch(`http://localhost:5196/api/students/${studentId}/subjects`)
        .then(response => response.json())
        .then(data => {
            
            data.forEach(subject => {
                const option = document.createElement("option");
                option.value = subject["subject"].id;
                option.textContent = `${subject["subject"].name}`;
                subjectsSelector.appendChild(option);


            });
        });
    }

});

