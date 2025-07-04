//ПРОВЕРКА ТАЙНИК:
function calculateDuration() 
{
    const travelTime = parseFloat(document.getElementById('travel_time').value) || 0;
    const inspection = parseFloat(document.getElementById('inspection').value) || 0;
    const legend = parseFloat(document.getElementById('legend').value) || 0;
    const checklist = parseFloat(document.getElementById('checklist').value) || 0;
    const report = parseFloat(document.getElementById('report').value) || 0;
    // Подсчет итоговой длительности
    const totalMinutes = (inspection + legend + checklist + report) + travelTime * 0.5;
    const durationHours = totalMinutes / 60;
    document.getElementById('calc_duration').textContent = `${durationHours.toFixed(2)} ч.`;
}

//ПРОВЕРКА КУРАТОР:
function checkCurator() 
{
    const audioDuration = parseFloat(document.getElementById('audio_duration').value) || 0;
    const findCache = parseFloat(document.getElementById('find_cache').value) || 0;
    // Подсчет итоговой длительности    
    const totalMinutes = audioDuration + findCache;
    const durationHours = totalMinutes / 60;
    document.getElementById('check_duration').textContent = `${durationHours.toFixed(2)} ч.`;
}

document.querySelectorAll('.parameter-input').forEach(input => {
    input.addEventListener('input', () => {
        calculateDuration();
        checkCurator();
    });
});

window.addEventListener('load', () => {
    calculateDuration();
    checkCurator();
});

// Окрытие модального окна 
function openModal() 
{
    const modal = document.getElementById("salaryModal");
    modal.style.display = "block";
}

// Закрытие модального окна
function closeModal() 
{
    const modal = document.getElementById("salaryModal");
    modal.style.display = "none";
}

document.querySelector('.btn-salary').addEventListener('click', function () {
    openModal();
});

function formatSalary(salary) 
{
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}

function populateSalaryTable() 
{
    const dataDiv = document.getElementById("salary-data");
    const salaryData = JSON.parse(dataDiv.getAttribute("data-salary"));
    const tbody = document.getElementById("salaryTableBody");
    tbody.innerHTML = "";
    salaryData.forEach(item => {
        const row = `
            <tr>
                <td>${item.region}</td>
                <td>${formatSalary(item.salary)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

window.addEventListener('load', populateSalaryTable);

function formatSalary(salary) 
{
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}

let globalSalaryData = []; 

function populateSalaryTable(data) 
{
    const tbody = document.getElementById("salaryTableBody");
    tbody.innerHTML = "";

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.region}</td>
                <td>${formatSalary(item.salary)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function setupSearch() 
{
    const input = document.getElementById("searchRegion");
    input.addEventListener("input", function () {
        const query = input.value.toLowerCase();

        const filtered = globalSalaryData.filter(item =>
            item.region.toLowerCase().includes(query)
        );
        populateSalaryTable(filtered);
    });
}

function loadSalaryData() 
{
    const dataDiv = document.getElementById("salary-data");
    globalSalaryData = JSON.parse(dataDiv.getAttribute("data-salary"));
    populateSalaryTable(globalSalaryData);
    setupSearch();
}

window.addEventListener('load', loadSalaryData);

//Получение данных 
const salaryJson = document.getElementById("salary-data").dataset.salary;
const salaryData = JSON.parse(salaryJson);
const container = document.getElementById("salaryInputsContainer");

// Изменение ЗП
function createSalaryInput(item, index) 
{
    const div = document.createElement("div");
    div.className = "parameter-block";
    div.innerHTML = 
    `
        <span class="parameter-name">${item.region}</span>
        <input 
            type="number" 
            class="parameter-input" 
            id="salary_${index}" 
            value="${item.salary}" 
            min="0" 
            step="1"
        >
    `;
    return div;
}

// Отображение всех объектов
function renderSalaryInputs(data) 
{
    container.innerHTML = ""; 
    data.forEach((item, index) => {
        const block = createSalaryInput(item, index);
        container.appendChild(block);
    });
}

// Вывод объектов
renderSalaryInputs(salaryData);

// Поиск
document.getElementById("searchRegion").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filtered = salaryData.filter(item =>
        item.region.toLowerCase().includes(query)
    );
    renderSalaryInputs(filtered);
});

function closeModal() 
{
    document.getElementById("salaryModal").style.display = "none";
    //Отчистка поля поиска
    document.getElementById("searchRegion").value = "";
    //Полный список объектов
    renderSalaryInputs(salaryData);
}




    