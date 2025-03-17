fetch('http://localhost:5196/api/students/1/statistics')
    .then(response => response.json())
    .then(data => {



        document.getElementById("average").textContent = data.average ?? '-';
        document.getElementById("median").textContent = data.median ?? '-';
        document.getElementById("mode").textContent = data.mode ?? '-';
        console.log(data.average);
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

        // line-diagram
        const lineChart = document.getElementById("lineChart");
        lineChart.innerHTML = "";
        if (data.changes && Array.isArray(data.changes) && data.changes.length > 0) {
            data.changes.forEach((grade, index) => {
                let point = document.createElement("div");
                point.className = "line-point";
                point.style.left = (index * 40) + "px"; 
                point.style.bottom = (grade * 20) + "px";
                lineChart.appendChild(point);
            });
        } else {
            lineChart.innerHTML = "<p>Nincs elérhető adat.</p>";
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