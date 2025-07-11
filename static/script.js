//  Глобальные переменные 
let globalSalaryData = [];
let tempSalaryData = []; 
let globalRequirementData = [];
let tempRequirementData = []; 

//  Форматирование цен 
function formatSalary(salary) {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}

// ДЛИТЕЛЬНОСТЬ ПРОВЕРКИ ТАЙНИКА 
function calculateDuration() {
    const travelTime = parseFloat(document.getElementById('travel_time').value) || 0;
    const inspection = parseFloat(document.getElementById('inspection').value) || 0;
    const legend = parseFloat(document.getElementById('legend').value) || 0;
    const checklist = parseFloat(document.getElementById('checklist').value) || 0;
    const report = parseFloat(document.getElementById('report').value) || 0;
    const totalMinutes = (inspection + legend + checklist + report) + travelTime * 0.5;
    const durationHours = totalMinutes / 60; 
    const calcDurationElement = document.getElementById('calc_duration');
    if (calcDurationElement) {
        calcDurationElement.textContent = `${durationHours.toFixed(2)} ч.`;
    }
    window.rawDurationHours = durationHours;

    return durationHours;
}

// ДЛИТЕЛЬНОСТЬ ПРОВЕРКИ КУРАТОРА
let rawCuratorDuration = 0;
function checkCurator() {
    const audioDuration = parseFloat(document.getElementById('audio_duration').value) || 0;
    const findCache = parseFloat(document.getElementById('find_cache').value) || 0;
    const totalMinutes = audioDuration + findCache;
    rawCuratorDuration = totalMinutes / 60; 
    const roundedValue = rawCuratorDuration.toFixed(2); 
    document.getElementById('check_duration').textContent = `${roundedValue} ч.`;
    recalculateAllRows();
}
function checkCuratorValue() {
    return rawCuratorDuration;
}
document.querySelectorAll('.parameter-input').forEach(input => {
    input.addEventListener('input', () => {
        calculateDuration();
        checkCurator();
    });
});

// Инициализация при загрузке страницы 
window.addEventListener('load', () => {
    loadInitialData();
    calculateDuration();
    checkCurator();
    populateSalaryTable(tempSalaryData);
    populateRequirementTable(tempRequirementData);
    setupSearch();
    setupRequirementSearch();
    
    // Инициализация блока "Дополнительно"
    const additionalContainer = document.getElementById("additionalWorkContainer");
    if (additionalContainer) {
        additionalContainer.innerHTML = '';
        if (getCurrentRequirementData().length > 0) {
            renderAdditionalRequirement(additionalContainer);
        }
    }
    
    calculateTotalPrice();
});

// Открытие/закрытие модальных окон 
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
    }
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}
document.querySelector('.btn-salary').addEventListener('click', function () {
    openModal("salaryModal");
    renderSalaryInputs(getCurrentSalaryData());
});
document.querySelector('.btn-requirements').addEventListener('click', function () {
    openModal("requirementModal");
    renderRequirementInputs(getCurrentRequirementData());
});
document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', function () {
        const modal = this.closest('.modal');
        if (modal && modal.id === 'salaryModal') {
            closeSalaryModal();
        } else if (modal && modal.id === 'requirementModal') {
            closeRequirementModal();
        }
    });
});

function loadInitialData() {
    // Загрузка зарплат
    const salaryDiv = document.getElementById("salary-data");
    if (salaryDiv) {
        globalSalaryData = JSON.parse(salaryDiv.getAttribute("data-salary"));
        tempSalaryData = JSON.parse(JSON.stringify(globalSalaryData)); // Сразу создаём копию
    }
    // Загрузка требований
    const requirementDiv = document.getElementById("requirement_data");
    if (requirementDiv) {
        globalRequirementData = JSON.parse(requirementDiv.getAttribute("requirement_data"));
        tempRequirementData = JSON.parse(JSON.stringify(globalRequirementData)); // Сразу создаём копию
    }
}

/// Обновлённые данные
function getCurrentSalaryData() {
    return tempSalaryData; 
}
function getCurrentRequirementData() {
    return tempRequirementData; 
}

// Поиск по объектам
function setupSearch() {
    const input = document.getElementById("searchRegion");
    if (!input) return;
    input.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const filtered = globalSalaryData.filter(item =>
            item.region.toLowerCase().includes(query)
        );
        renderSalaryInputs(filtered);
        populateSalaryTable(filtered);
    });
}

function populateSalaryTable(data) {
    const tbody = document.getElementById("salaryTableBody");
    if (!tbody) return;
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
function populateRequirementTable(data) {
    const container = document.getElementById("requirementInputsContainer");
    if (!container) return;
    container.innerHTML = "";
    data.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "parameter-block";
        div.innerHTML = `
            <div class="requirement-row">
                <span class="parameter-name">${item.name}</span>
                <input 
                    type="number" 
                    class="parameter-input input-price" 
                    id="requirement_price_${index}" 
                    value="${item.price}" 
                    min="0" 
                    step="1"
                >
                <span class="parameter-explanation">${item.explanation}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function createSalaryInput(item, index) {
    const div = document.createElement("div");
    div.className = "parameter-block";
    div.innerHTML = `
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
function createRequirementInput(item, index) {
    const div = document.createElement("div");
    div.className = "parameter-block";
    div.innerHTML = `
        <div class="requirement-row">
            <span class="parameter-name">${item.name}</span>
            <input 
                type="number" 
                class="parameter-input input-price" 
                id="requirement_price_${index}" 
                value="${item.price}" 
                min="0" 
                step="1"
            >
            <span class="parameter-explanation">${item.explanation}</span>
        </div>
    `;
    return div;
}
function renderSalaryInputs(data) {
    const container = document.getElementById("salaryInputsContainer");
    if (!container) return;
    container.innerHTML = "";
    data.forEach((item, index) => {
        const block = createSalaryInput(item, index);
        container.appendChild(block);
    });
}
function renderRequirementInputs(data) {
    const container = document.getElementById("requirementInputsContainer");
    if (!container) return;
    container.innerHTML = "";
    data.forEach((item, index) => {
        const block = createRequirementInput(item, index);
        container.appendChild(block);
    });
}

function saveSalaryChanges() {
    const inputs = document.querySelectorAll("#salaryInputsContainer .parameter-input");
    inputs.forEach((input, index) => {
        const newValue = parseInt(input.value) || 0;
        tempSalaryData[index].salary = newValue;
    });

    globalRequirementData = JSON.parse(JSON.stringify(tempRequirementData));
    updateAllRatesInTable();
    updateAllDropdowns(); 
    recalculateAllRows();

    alert("Изменения зарплат сохранены!");
    closeModal("salaryModal");
}

function saveRequirementChanges() {
    const inputs = document.querySelectorAll("#requirementInputsContainer .input-price");
    inputs.forEach((input, index) => {
        const newValue = parseInt(input.value) || 0;
        tempRequirementData[index].price = newValue;
    });

    globalRequirementData = JSON.parse(JSON.stringify(tempRequirementData));
    alert("Изменения требований сохранены!");
    closeModal("requirementModal");

    updateAllAdditionalPrices();
    calculateTotalPrice();
}

function closeSalaryModal() {
    document.getElementById("salaryModal").style.display = "none";
    const searchInput = document.getElementById("searchRegion");
    if (searchInput) searchInput.value = "";
    renderSalaryInputs(globalSalaryData);
}
function closeRequirementModal() {
    document.getElementById("requirementModal").style.display = "none";
    const searchInput = document.getElementById("searchRequirement");
    if (searchInput) searchInput.value = "";
    renderRequirementInputs(globalRequirementData);
}

//ДОПОЛНИТЕЛЬНО
function renderAdditionalRequirement(container, requirementName = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "select-with-price";

    // Выпадающий список
    const select = document.createElement("select");
    select.innerHTML = `
        <option value="">Выберите требование</option>
        ${getCurrentRequirementData().map(item => `
            <option value="${item.name}" ${requirementName === item.name ? 'selected' : ''}>
                ${item.name}
            </option>
        `).join("")}
    `;

    // Поле для отображения цены
    const priceDisplay = document.createElement("div");
    priceDisplay.className = "price";
    priceDisplay.textContent = "0 ₽";
    
    if (requirementName) {
        const selected = getCurrentRequirementData().find(r => r.name === requirementName);
        priceDisplay.textContent = selected ? formatPrice(selected.price) : "0 ₽";
    } else {
        priceDisplay.textContent = "0 ₽";
    }

    // Обработчик изменения
    select.addEventListener("change", function () {
        const selected = getCurrentRequirementData().find(r => r.name === this.value);
        priceDisplay.textContent = selected ? formatPrice(selected.price) : "0 ₽";
        updateJoinArray();
        calculateTotalPrice();
        recalculateAllRows();
    });

    if (requirementName) {
        const event = new Event('change');
        select.dispatchEvent(event);
    }

    wrapper.appendChild(select);
    wrapper.appendChild(priceDisplay);
    container.appendChild(wrapper);
}

// Добавление нового блока 
function addNewRequirement() {
    const container = document.getElementById("additionalWorkContainer");
    if (!container) return;
    renderAdditionalRequirement(container);
}

function updateAllAdditionalPrices() {
    const containers = document.querySelectorAll("#additionalWorkContainer .select-with-price");

    containers.forEach(wrapper => {
        const select = wrapper.querySelector("select");
        const priceDisplay = wrapper.querySelector(".price");

        if (select && priceDisplay) {
            const selectedName = select.value;
            const requirement = globalRequirementData.find(r => r.name === selectedName);
            const price = requirement ? requirement.price : 0;
            priceDisplay.textContent = formatPrice(price);
        }
    });
    updateJoinArray();
    calculateTotalPrice();
    recalculateAllRows(); 
}

let join = [];
function updateJoinArray() {
    join = Array.from(document.querySelectorAll("#additionalWorkContainer .select-with-price"))
        .map(wrapper => {
            const select = wrapper.querySelector("select");
            const selectedName = select ? select.value : "";
            const requirement = selectedName ? 
                globalRequirementData.find(r => r.name === selectedName) : null;
            return requirement ? requirement.price : 0;
        });
}

function calculateTotalPrice() {
    const prices = Array.from(document.querySelectorAll("#additionalWorkContainer .select-with-price"))
        .map(wrapper => {
            const select = wrapper.querySelector("select");
            const selectedName = select ? select.value : "";
            const requirement = selectedName ? 
                globalRequirementData.find(r => r.name === selectedName) : null;
            return requirement ? requirement.price : 0;
        })
        .filter(price => price > 0); 
    if (prices.length === 0) {
        document.getElementById("sum_price_join").textContent = "0 ₽";
        return 0;
    }
    const maxPrice = Math.max(...prices);
    const sum = prices.reduce((acc, price) => {
        return acc + Math.pow(price / maxPrice, 0.7);
    }, 0);
    const result = maxPrice * Math.sqrt(sum);
    const rawValue = result;
    const roundedResult = Math.round((result / 10) * 10); 
    const sumDisplay = document.getElementById("sum_price_join");
    if (sumDisplay) {
        sumDisplay.textContent = formatPrice(roundedResult);
    }
    return { rawValue, roundedResult }; 
}
function getTotalAdditionalPrice() {
    updateJoinArray();
    const result = calculateTotalPrice(); 
    return result.rawValue|| 0;
}

// ПРЕДВАРИТЕЛЬНАЯ СТОИМОСТЬ
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initCostTable, 100);
});

let currentHiddenHours = 0;
function initCostTable() {
    const table = document.querySelector('.cost-table tbody');
    if (!table) return;
    table.innerHTML = '';
    updateHiddenHours();
    // Начальные строки
    const rows = [
        { name: "Тайник", officeCost: 0, markup: 30 },
        { name: "Куратор", officeCost: 0, markup: 30 },
        { name: "Дополнительно", officeCost: 0, markup: 30 }
    ];
    rows.forEach(rowData => {
        addNewRow(table, rowData);
    });
    setupHoursAutoUpdate(table);
}

// СТОЛБЕЦ 2: Часов тайник
function updateHiddenHours() {
    const durationInMinutes = calculateDuration() * 60;
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        currentHiddenHours = 0;
    } else {
        currentHiddenHours = (durationInMinutes / 60) / 24;
    }
    return currentHiddenHours;
}

function formatDecimalDayToTime(decimalDay) {
    const totalMinutes = Math.round(decimalDay * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function setupHoursAutoUpdate(table) {
    function updateAllHours() {
        updateHiddenHours(); 
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const hoursCell = row.querySelector('.hours');
            if (hoursCell) {
                hoursCell.textContent = formatDecimalDayToTime(currentHiddenHours); 
                updateRowCalculations(row);
            }
        });
    }
    ['travel_time', 'inspection', 'legend', 'checklist', 'report'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateAllHours);
        }
    });
    updateAllHours();
}
function addNewRow(table, rowData = { name: "", officeCost: 0, markup: 30 }) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="object-cell"></td>
        <td class="hours">${formatDecimalDayToTime(currentHiddenHours)}</td>
        <td class="rate">0 ₽</td>
        <td class="hidden-cost">0.00 ₽</td>
        <td class="office-cost">${rowData.officeCost.toFixed(2)} ₽</td>
        <td class="total-cost">0.00 ₽</td>
        <td class="markup"><input type="number" class="markup-input" value="${rowData.markup}" min="0" step="1"> %</td>
        <td class="final-price">0.00 ₽</td>
        <td class="profit">0.00 ₽</td>
    `;
    const cell = row.querySelector(".object-cell");
    createObjectDropdown(cell, table);
    const markupInput = row.querySelector('.markup-input');
    if (markupInput && !markupInput._listenerAdded) {
        markupInput.addEventListener('input', () => {
            updateRowCalculations(row);
        });
        markupInput._listenerAdded = true;
    }
    table.appendChild(row);
    return row;
}

function createObjectDropdown(cell, table) {
    cell.innerHTML = '';
    const select = document.createElement('select');
    select.className = 'object-select';
    select.style.width = '100%';
    select.style.padding = '5px';
    const salaryData = getCurrentSalaryData();
    if (!salaryData || salaryData.length === 0) {
        select.innerHTML = '<option value="">Данные не загружены</option>';
        cell.appendChild(select);
        return;
    }
    select.innerHTML = `
        <option value="">Выберите объект</option>
        ${salaryData.map(item => `
            <option value="${item.region}" data-salary="${item.salary}">
                ${item.region} 
            </option>
        `).join('')}
    `;
    cell.appendChild(select);
    select.addEventListener('change', function () {
        updateRowFromSelect(this);
         const allRows = table.querySelectorAll('tr');
    const currentRow = this.closest('tr');
    const isLastRow = allRows[allRows.length - 1] === currentRow;
    if (isLastRow && this.value && currentRow.querySelector('.rate').textContent !== '0 ₽') {
        setTimeout(() => addNewRow(table), 50); 
    }
    });
}

//СТОЛБЕЦ 3: Ставка/час
function updateRowFromSelect(select) {
    const row = select.closest('tr');
    const selectedOption = select.options[select.selectedIndex];
    let rawHourlyRate = 0;
    if (selectedOption && selectedOption.value) {
        const salary = parseFloat(selectedOption.dataset.salary) || 0;
        rawHourlyRate = salary / 168; 
        const hourlyRate = Math.round(rawHourlyRate);

        row.querySelector('.rate').textContent = formatSalary(hourlyRate);
        row.querySelector('.rate').dataset.rawHourlyRate = rawHourlyRate; 
    } else {
        row.querySelector('.rate').textContent = '';
        row.querySelector('.rate').dataset.rawHourlyRate = '0';
    }

    updateRowCalculations(row);
    return {
        rawHourlyRate, 
        roundedHourlyRate: Math.round(rawHourlyRate)
    };
}

function updateAllRatesInTable() {
    const table = document.querySelector('.cost-table tbody');
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const select = row.querySelector('.object-select');
        if (select && select.value) {
            const selectedOption = select.options[select.selectedIndex];
            const salary = parseFloat(selectedOption.dataset.salary) || 0;
            const hourlyRate = salary ? Math.round(salary / 168) : 0;
            row.querySelector('.rate').textContent = formatSalary(hourlyRate);
            updateRowCalculations(row);
        }
    });
}

function updateRowCalculations(row) {
if (row.querySelector('.total-cost input')) {
    row.querySelector('.total-cost').innerHTML = formatSalary(totalCost);
    console.warn('Обнаружен лишний input в столбце 6 - исправлено');
}
    const cells = {
        hours: row.querySelector('.hours'),
        rate: row.querySelector('.rate'),
        officeCost: row.querySelector('.office-cost'),
        markupCell: row.querySelector('.markup'),
        hiddenCost: row.querySelector('.hidden-cost'),
        totalCost: row.querySelector('.total-cost'),
        finalPrice: row.querySelector('.final-price'),
        profit: row.querySelector('.profit'),
        objectSelect: row.querySelector('.object-cell select'),
    };
    const isObjectSelected = cells.objectSelect && cells.objectSelect.value !== '';
    const values = {
        hourlyRate: parseFloat(cells.rate.textContent.replace(/\s/g, '').replace("₽", '')) || 0,
        officeCost: parseFloat(cells.officeCost.textContent.replace(/\s/g, '').replace("₽", '')) || 0,
        durationHours: calculateDuration() || 0,
        curatorDuration: checkCuratorValue() || 0,
        sumPriceAdditional: isObjectSelected ? getTotalAdditionalPrice() || 0 : 0
    };
    const hourlyRateRaw = parseFloat(cells.rate.dataset.rawHourlyRate) || 0;
    //СТОЛБЕЦ 4: Затраты тайник
    let hiddenCost = 0;
    if (isObjectSelected) {
        hiddenCost = hourlyRateRaw * values.durationHours + values.sumPriceAdditional * 0.3;
    }
    const roundedHiddenCost = Math.floor(hiddenCost / 10) * 10;
    cells.hiddenCost.textContent = formatSalary(roundedHiddenCost);
    // СТОЛБЕЦ 5: Затраты офис
   let officeCostCalculated = 0;
    if (isObjectSelected) {
        officeCostCalculated = values.curatorDuration * hourlyRateRaw + values.sumPriceAdditional * 0.7;
    }
    const roundedOfficeCost = Math.round(officeCostCalculated);
    cells.officeCost.textContent = formatSalary(roundedOfficeCost); 
    // СТОЛБЕЦ 6: Затраты итого 
    const totalCost = roundedHiddenCost + roundedOfficeCost;
    cells.totalCost.textContent = formatSalary(totalCost);
    // СТОЛБЕЦ 7: Наценка 
    const markupInput = cells.markupCell.querySelector('input');
    let markup = 30; 
    if (markupInput) {
        markup = parseFloat(markupInput.value) || 0;
    }
    // СТОЛБЕЦ 8: Стоимость
    const finalPrice = calculateFinalPrice(totalCost, markup);
    cells.finalPrice.textContent = formatSalary(finalPrice);

    // СТОЛБЕЦ 9: Прибыль 
    const profit = calculateProfit(finalPrice, markup);
    cells.profit.textContent = formatSalary(profit);
    if (markupInput && !markupInput._listenerAdded) {
        markupInput.addEventListener('input', () => {
            updateRowCalculations(row);
        });
        markupInput._listenerAdded = true;
    }

     // Отладка
    console.debug('Row calculations:', {
        row: row.rowIndex,
        hourlyRateRaw,
        curatorDuration: values.curatorDuration,
        sumPriceAdditional: values.sumPriceAdditional,
        officeCostCalculated,
        roundedOfficeCost,
        totalCost,
        markup,
        finalPrice,
        profit
    });
}

// СТОЛБЕЦ 8: 
function calculateFinalPrice(totalCost, markup) {
    totalCost = parseFloat(totalCost) || 0;
    markup = parseFloat(markup) || 0;
    const finalPriceBeforeRounding = totalCost * (1 + markup / 100);
    const roundedFinalPrice = Math.ceil(finalPriceBeforeRounding / 100) * 100;
    return roundedFinalPrice;
}

function calculateProfit(finalPrice, markup) {
    finalPrice = parseFloat(finalPrice) || 0;
    markup = parseFloat(markup) || 0;
    const profit = finalPrice * (markup / 100);
    return Math.round(profit); 
}

function checkCuratorValue() {
    const audioDuration = parseFloat(document.getElementById('audio_duration').value) || 0;
    const findCache = parseFloat(document.getElementById('find_cache').value) || 0;
    const totalMinutes = audioDuration + findCache;
    const durationHours = totalMinutes / 60;
    return parseFloat(durationHours.toFixed(2));
}


function recalculateAllRows() {
    const table = document.querySelector('.cost-table tbody');
    if (!table) return;
    table.querySelectorAll('tr').forEach(updateRowCalculations);
}



// Обновление
function updateAllDropdowns() {
    const table = document.querySelector('.cost-table tbody');
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cell = row.querySelector(".object-cell");
        if (cell) {
            const currentSelect = cell.querySelector('select');
            const currentValue = currentSelect ? currentSelect.value : "";
            createObjectDropdown(cell, table);
            const newSelect = cell.querySelector('select');
            if (newSelect && currentValue) {
                newSelect.value = currentValue;
                updateRowFromSelect(newSelect);
            }
        }
    });
}

function formatSalary(amount) {
    if (isNaN(amount)) return "0 ₽";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}
