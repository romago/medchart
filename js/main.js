// Main initialization script
Chart.register(ChartDataLabels);

// Global chart instances
let pacuFccChartInstance = null;
let operationRoomChartInstance = null;

// Global time selectors state
let pacuFccSelectedTimeFrom = '18:30';
let pacuFccSelectedTimeTo = '22:15';
let operationRoomSelectedTimeFrom = '22:10';
let operationRoomSelectedTimeTo = '23:55';

// Initialize time selectors
function initializeTimeSelectors(chartType) {
    let timeOptions, fromSelector, toSelector, selectedTimeFrom, selectedTimeTo, timeFormatSelector;
    
    if (chartType === 'pacu-fcc') {
        timeOptions = generateTimeOptions('18:30', '22:15', 15);
        fromSelector = document.getElementById('pacuFccTimeFromSelector');
        toSelector = document.getElementById('pacuFccTimeToSelector');
        timeFormatSelector = document.getElementById('pacuFccTimeFormatSelector');
        selectedTimeFrom = pacuFccSelectedTimeFrom;
        selectedTimeTo = pacuFccSelectedTimeTo;
    } else {
        timeOptions = generateTimeOptions('22:10', '00:30', 15);
        fromSelector = document.getElementById('operationRoomTimeFromSelector');
        toSelector = document.getElementById('operationRoomTimeToSelector');
        timeFormatSelector = document.getElementById('operationRoomTimeFormatSelector');
        selectedTimeFrom = operationRoomSelectedTimeFrom;
        selectedTimeTo = operationRoomSelectedTimeTo;
    }
    
    const use24HourFormat = timeFormatSelector.value === 'yes';
    const selectedFromMinutes = timeToMinutes(selectedTimeFrom);
    
    // Populate "From" selector
    fromSelector.innerHTML = '';
    timeOptions.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = formatTime(time, use24HourFormat);
        option.selected = time === selectedTimeFrom;
        fromSelector.appendChild(option);
    });
    
    // Populate "To" selector
    toSelector.innerHTML = '';
    const validToTimes = [];
    timeOptions.forEach(time => {
        const timeMinutes = timeToMinutes(time);
        if (timeMinutes > selectedFromMinutes) {
            validToTimes.push(time);
            const option = document.createElement('option');
            option.value = time;
            option.textContent = formatTime(time, use24HourFormat);
            option.selected = time === selectedTimeTo;
            toSelector.appendChild(option);
        }
    });
    
    // Update global selected time if needed
    if (chartType === 'pacu-fcc' && (timeToMinutes(pacuFccSelectedTimeTo) <= selectedFromMinutes || !validToTimes.includes(pacuFccSelectedTimeTo))) {
        if (validToTimes.length > 0) {
            pacuFccSelectedTimeTo = validToTimes[validToTimes.length - 1];
            const options = toSelector.querySelectorAll('option');
            options.forEach(opt => opt.selected = opt.value === pacuFccSelectedTimeTo);
        }
    } else if (chartType === 'operation-room' && (timeToMinutes(operationRoomSelectedTimeTo) <= selectedFromMinutes || !validToTimes.includes(operationRoomSelectedTimeTo))) {
        if (validToTimes.length > 0) {
            operationRoomSelectedTimeTo = validToTimes[validToTimes.length - 1];
            const options = toSelector.querySelectorAll('option');
            options.forEach(opt => opt.selected = opt.value === operationRoomSelectedTimeTo);
        }
    }
}

// Update time selectors when "From" changes
function updateTimeSelectors(chartType) {
    let timeOptions, fromSelector, toSelector, selectedTimeFrom, selectedTimeTo, timeFormatSelector;
    
    if (chartType === 'pacu-fcc') {
        timeOptions = generateTimeOptions('18:30', '22:15', 15);
        fromSelector = document.getElementById('pacuFccTimeFromSelector');
        toSelector = document.getElementById('pacuFccTimeToSelector');
        timeFormatSelector = document.getElementById('pacuFccTimeFormatSelector');
        selectedTimeFrom = pacuFccSelectedTimeFrom;
        selectedTimeTo = pacuFccSelectedTimeTo;
    } else {
        timeOptions = generateTimeOptions('22:10', '00:30', 15);
        fromSelector = document.getElementById('operationRoomTimeFromSelector');
        toSelector = document.getElementById('operationRoomTimeToSelector');
        timeFormatSelector = document.getElementById('operationRoomTimeFormatSelector');
        selectedTimeFrom = operationRoomSelectedTimeFrom;
        selectedTimeTo = operationRoomSelectedTimeTo;
    }
    
    const use24HourFormat = timeFormatSelector.value === 'yes';
    const selectedFromMinutes = timeToMinutes(selectedTimeFrom);
    
    // Update "To" selector
    toSelector.innerHTML = '';
    const validToTimes = [];
    timeOptions.forEach(time => {
        const timeMinutes = timeToMinutes(time);
        if (timeMinutes > selectedFromMinutes) {
            validToTimes.push(time);
            const option = document.createElement('option');
            option.value = time;
            option.textContent = formatTime(time, use24HourFormat);
            option.selected = time === selectedTimeTo;
            toSelector.appendChild(option);
        }
    });
    
    // Update global selected time if needed
    if (chartType === 'pacu-fcc' && (timeToMinutes(pacuFccSelectedTimeTo) <= selectedFromMinutes || !validToTimes.includes(pacuFccSelectedTimeTo))) {
        if (validToTimes.length > 0) {
            pacuFccSelectedTimeTo = validToTimes[validToTimes.length - 1];
            const options = toSelector.querySelectorAll('option');
            options.forEach(opt => opt.selected = opt.value === pacuFccSelectedTimeTo);
        }
    } else if (chartType === 'operation-room' && (timeToMinutes(operationRoomSelectedTimeTo) <= selectedFromMinutes || !validToTimes.includes(operationRoomSelectedTimeTo))) {
        if (validToTimes.length > 0) {
            operationRoomSelectedTimeTo = validToTimes[validToTimes.length - 1];
            const options = toSelector.querySelectorAll('option');
            options.forEach(opt => opt.selected = opt.value === operationRoomSelectedTimeTo);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize time selectors for both charts
    initializeTimeSelectors('pacu-fcc');
    initializeTimeSelectors('operation-room');
    
    // Initialize PACU/FCC Chart
    pacuFccChartInstance = createChart(
        'pacuFccChart',
        pacuFccVitalSignsData,
        createPacuFccMedicalActionFlags,
        createPacuFccNotesFlags,
        createPacuFccOrdersFlags,
        null, // no transfusion for PACU/FCC
        null, // no vasopressors for PACU/FCC
        createPacuFccInterventionsFlags, // interventions for PACU/FCC
        null, // no Dr. Smith MTP for PACU/FCC
        'pacu-fcc',
        '18:30',
        '22:15'
    );
    
    // Initialize Operation Room Chart
    operationRoomChartInstance = createChart(
        'operationRoomChart',
        operationRoomVitalSignsData,
        createOperationRoomMedicalActionFlags,
        createOperationRoomNotesFlags,
        createOperationRoomOrdersFlags,
        createOperationRoomTransfusionFlags,
        createOperationRoomVasopressorsFlags,
        createOperationRoomInterventionsFlags,
        createOperationRoomMTPEventFlags,
        'operation-room',
        '22:10',
        '23:55'
    );
    
    // PACU/FCC Event Listeners
    document.getElementById('pacuFccVitalSelector').addEventListener('change', function() {
        pacuFccChartInstance.updateVital(this.value);
    });
    
    document.getElementById('pacuFccTimeFromSelector').addEventListener('change', function() {
        pacuFccSelectedTimeFrom = this.value;
        updateTimeSelectors('pacu-fcc');
        pacuFccChartInstance.updateTimeRange(pacuFccSelectedTimeFrom, pacuFccSelectedTimeTo);
    });
    
    document.getElementById('pacuFccTimeToSelector').addEventListener('change', function() {
        pacuFccSelectedTimeTo = this.value;
        pacuFccChartInstance.updateTimeRange(pacuFccSelectedTimeFrom, pacuFccSelectedTimeTo);
    });
    
    document.getElementById('pacuFccPrintChart').addEventListener('click', function() {
        printChart('pacuFccChart', 'PACU/FCC Timeline');
    });
    
    // PACU/FCC Time Format Selector
    document.getElementById('pacuFccTimeFormatSelector').addEventListener('change', function() {
        const use24HourFormat = this.value === 'yes';
        pacuFccChartInstance.updateTimeFormat(use24HourFormat);
        initializeTimeSelectors('pacu-fcc');  // Refresh time selectors with new format
    });
    
    // Operation Room Event Listeners
    document.getElementById('operationRoomVitalSelector').addEventListener('change', function() {
        operationRoomChartInstance.updateVital(this.value);
    });
    
    document.getElementById('operationRoomTimeFromSelector').addEventListener('change', function() {
        operationRoomSelectedTimeFrom = this.value;
        updateTimeSelectors('operation-room');
        operationRoomChartInstance.updateTimeRange(operationRoomSelectedTimeFrom, operationRoomSelectedTimeTo);
    });
    
    document.getElementById('operationRoomTimeToSelector').addEventListener('change', function() {
        operationRoomSelectedTimeTo = this.value;
        operationRoomChartInstance.updateTimeRange(operationRoomSelectedTimeFrom, operationRoomSelectedTimeTo);
    });
    
    document.getElementById('operationRoomPrintChart').addEventListener('click', function() {
        printChart('operationRoomChart', 'Operation Room Timeline');
    });
    
    // Operation Room Time Format Selector
    document.getElementById('operationRoomTimeFormatSelector').addEventListener('change', function() {
        const use24HourFormat = this.value === 'yes';
        operationRoomChartInstance.updateTimeFormat(use24HourFormat);
        initializeTimeSelectors('operation-room');  // Refresh time selectors with new format
    });
    
    // Tab switch handlers to ensure charts are properly rendered
    document.getElementById('pacu-fcc-tab').addEventListener('shown.bs.tab', function (e) {
        if (pacuFccChartInstance && pacuFccChartInstance.chart) {
            setTimeout(() => {
                pacuFccChartInstance.chart.resize();
            }, 100);
        }
    });
    
    document.getElementById('operation-room-tab').addEventListener('shown.bs.tab', function (e) {
        if (operationRoomChartInstance && operationRoomChartInstance.chart) {
            setTimeout(() => {
                operationRoomChartInstance.chart.resize();
            }, 100);
        }
    });
});