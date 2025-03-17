fetch('http://localhost:5196/api/students')
    .then(response => response.json())
    .then(data => {
        studentsPicker = document.getElementById("students_picker");

        const table = document.getElementById('studentsTable');
        let tableBody = table.querySelector('tbody');
        tableBody.innerHTML = '';

        data.forEach(student => {
            const option = document.createElement("option");
            option.value = student.id;
            option.textContent = `${student.firstName} ${student.lastName}`;
            studentsPicker.appendChild(option);



            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = `${student.firstName} ${student.lastName}`;
            row.appendChild(nameCell);

            const dobCell = document.createElement('td');
            dobCell.textContent = new Date(student.dateOfBirth).toLocaleDateString();
            row.appendChild(dobCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = student.email;
            row.appendChild(emailCell);

            const gradesCell = document.createElement('td');
            if (student.grades && student.grades.length > 0) {
                const gradesText = student.grades.map(grade => {
                    fetch(`http://localhost:5196/api/subjects/${grade.subjectId}`)
                    .then(subjectResponse => subjectResponse.json())
                    return `Tantárgy ID: ${grade.subjectId}, Jegy: ${grade.gradeValue}`;
                }).join('<br>');
                gradesCell.innerHTML = gradesText;
            } else {
                gradesCell.textContent = 'Nincs jegy';
            }
            row.appendChild(gradesCell);

            tableBody.appendChild(row);


            
        });
    });
