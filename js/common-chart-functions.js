// Common chart functions and utilities
// Convert time string to minutes from midnight
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    // Handle 24:00 as end of day (1440 minutes)
    if (hours === 24 && minutes === 0) {
        return 1440;
    }
    // Handle times after midnight (00:XX) - they get converted to next day minutes
    if (hours === 0) {
        return 1440 + minutes; // 00:00 = 1440, 00:15 = 1455, etc.
    }
    return hours * 60 + minutes;
}

// Convert minutes back to time string
function minutesToTime(minutes) {
    // Handle midnight as 00:00
    if (minutes === 1440) {
        return '00:00';
    }
    // Handle times after midnight (> 1440 minutes)
    if (minutes > 1440) {
        const adjustedMinutes = minutes - 1440;
        const hours = Math.floor(adjustedMinutes / 60);
        const mins = adjustedMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // Convert 24:XX to 00:XX
    if (hours >= 24) {
        hours = hours % 24;
    }
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Convert 24-hour time to 12-hour format
function convertTo12HourFormat(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    let displayHours = hours;
    let period = 'AM';
    
    if (hours === 0) {
        displayHours = 12;
        period = 'AM';
    } else if (hours === 12) {
        displayHours = 12;
        period = 'PM';
    } else if (hours > 12) {
        displayHours = hours - 12;
        period = 'PM';
    }
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format time based on user preference (24h or 12h)
function formatTime(time24, use24HourFormat = true) {
    if (use24HourFormat) {
        return time24;
    } else {
        return convertTo12HourFormat(time24);
    }
}

// Normal ranges for vital signs
const normalRanges = {
    hr: { min: 60, max: 100, label: 'Normal HR (60-100)' },
    systolic: { min: 90, max: 140, label: 'Normal Systolic BP (90-140)' },
    diastolic: { min: 50, max: 90, label: 'Normal Diastolic BP (50-90)' },
    map: { min: 65, max: 105, label: 'Normal MAP (65-105)' },
    rr: { min: 12, max: 22, label: 'Normal RR (12-22)' },
    si: { min: 0.5, max: 0.9, label: 'Normal SI (0.5-0.9)' }
};

// Create normal range area dataset
function createNormalRangeDataset(selectedVital, startTime, endTime) {
    const range = normalRanges[selectedVital];
    if (!range) return [];
    
    const startMinutes = timeToMinutes(startTime) - 5;
    const endMinutes = timeToMinutes(endTime) + 5;
    
    return [
        {
            label: `${range.label} - Upper`,
            type: 'line',
            data: [
                { x: startMinutes, y: range.max },
                { x: endMinutes, y: range.max }
            ],
            backgroundColor: 'rgba(46, 204, 113, 0.10)',
            borderColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 1,
            fill: '+1',
            pointRadius: 0,
            showLine: true,
            order: 20
        },
        {
            label: `${range.label} - Lower`,
            type: 'line',
            data: [
                { x: startMinutes, y: range.min },
                { x: endMinutes, y: range.min }
            ],
            backgroundColor: 'rgba(46, 204, 113, 0.10)',
            borderColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            showLine: true,
            order: 20
        }
    ];
}

// Create callout lines from X-axis to flags
function createCalloutLines(flagData, yMin = -100, yMax = 200, selectedVital = 'hr') {
    const lines = [];
    
    // Custom offsets for different vital signs (positive and negative areas)
    let positiveOffset, negativeOffset;
    switch(selectedVital) {
        case 'si': // Shock Index
            positiveOffset = 0.1;
            negativeOffset = 0.1;
            break;
        case 'hr': // Heart Rate
            positiveOffset = 6;
            negativeOffset = 6;
            break;
        case 'systolic': // Systolic BP
            positiveOffset = 5.8;
            negativeOffset = 5.8;
            break;
        case 'diastolic': // Diastolic BP
            positiveOffset = 4.5;
            negativeOffset = 4.5;
            break;
        case 'map': // Mean Arterial Pressure
            positiveOffset = 5;
            negativeOffset = 5;
            break;
        case 'rr': // Respiratory Rate
            positiveOffset = 3;
            negativeOffset = 3;
            break;
        default:
            positiveOffset = 4;
            negativeOffset = 4;
    }
    
    flagData.forEach((flag, index) => {
        // Use different offsets for positive and negative areas
        const yOffset = flag.y >= 0 ? positiveOffset : -negativeOffset;
        lines.push(
            { x: flag.x, y: yOffset },
            { x: flag.x, y: flag.y },
            { x: null, y: null }
        );
    });
    return lines;
}

// Create callout lines for medical actions
function createMedicalCalloutLines(medicalFlags, yMin = -100, yMax = 200, selectedVital = 'hr') {
    // Use the same logic as createCalloutLines - no need to duplicate
    return createCalloutLines(medicalFlags, yMin, yMax, selectedVital);
}

// Filter data by time range
function filterDataByTimeRange(dataPoints, timeLabels, timeFrom, timeTo) {
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    const filteredData = [];
    const filteredLabels = [];
    let startIndex = -1;
    
    dataPoints.forEach((point, index) => {
        const pointMinutes = timeToMinutes(point.time);
        if (pointMinutes >= fromMinutes && pointMinutes <= toMinutes) {
            if (startIndex === -1) startIndex = index;
            filteredData.push(point);
            filteredLabels.push(point.time);
        }
    });
    
    return {
        filteredData: filteredData,
        filteredLabels: filteredLabels,
        startIndex: startIndex === -1 ? 0 : startIndex
    };
}

// Generate time options
function generateTimeOptions(startTime, endTime, intervalMinutes = 15) {
    const times = [];
    let currentTime = timeToMinutes(startTime);
    let endTimeMinutes = timeToMinutes(endTime);
    
    // Handle crossing midnight (e.g., from 22:10 to 00:30)
    if (endTimeMinutes <= currentTime && endTime.startsWith('00:')) {
        endTimeMinutes += 1440; // Add 24 hours worth of minutes
    }
    
    while (currentTime <= endTimeMinutes) {
        times.push(minutesToTime(currentTime));
        currentTime += intervalMinutes;
    }
    return times;
}

// Create combined flag data points
function createCombinedFlags(dataPoints, selectedVital = 'hr', timeFrom = '18:30', timeTo = '22:10', timeLabels) {
    const filtered = filterDataByTimeRange(dataPoints, timeLabels, timeFrom, timeTo);
    const flags = [];
    
    const vitalLabels = {
        'systolic': 'Systolic BP',
        'diastolic': 'Diastolic BP', 
        'hr': 'Heart Rate',
        'map': 'MAP',
        'rr': 'Respiratory Rate',
        'si': 'Shock Index'
    };

    const vitalShortLabels = {
        'systolic': 'SBP',
        'diastolic': 'DBP', 
        'hr': 'HR',
        'map': 'MAP',
        'rr': 'RR',
        'si': 'SI'
    };
    
    filtered.filteredData.forEach((point, index) => {
        // Skip null data points
        if (point.systolic === null && point.diastolic === null && 
            point.hr === null && point.map === null && point.rr === null && point.si === null) {
            return;
        }
        
        // Skip if selected vital is null
        if (point[selectedVital] === null) {
            return;
        }
        
        // Create combined data label
        const dataLines = [];
        if (point.systolic !== null) dataLines.push(`Systolic BP: ${point.systolic}`);
        if (point.diastolic !== null) dataLines.push(`Diastolic BP: ${point.diastolic}`);
        if (point.hr !== null) dataLines.push(`Heart Rate: ${point.hr}`);
        if (point.map !== null) dataLines.push(`MAP: ${point.map}`);
        if (point.rr !== null) dataLines.push(`RR: ${point.rr}`);
        if (point.si !== null) dataLines.push(`Shock Index: ${point.si}`);
        
        flags.push({
            x: timeToMinutes(point.time),
            y: point[selectedVital],
            time: point.time,
            data: dataLines,
            label: dataLines.join('\n'),
            selectedLabel: vitalLabels[selectedVital],
            shortLabel: `${vitalShortLabels[selectedVital]} ${point[selectedVital]}`,
            [selectedVital]: point[selectedVital] // Add the selected vital value directly
        });
    });
    
    return {
        flags: flags,
        filteredLabels: filtered.filteredLabels
    };
}

// Print function for Chart.js
function printChart(chartId, chartTitle) {
    const canvas = document.getElementById(chartId);
    const printWindow = window.open('', '_blank');
    const printDocument = printWindow.document;
    
    const chartImageData = canvas.toDataURL('image/png', 1.0);
    
    const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Chart - ${chartTitle}</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 1cm;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                }
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    color: #34495e;
                }
                .chart-image {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .print-info {
                    margin-top: 2rem;
                    font-size: 0.8rem;
                    color: #7f8c8d;
                }
            </style>
        </head>
        <body>
            <h1>${chartTitle}</h1>
            <img src="${chartImageData}" alt="Vital Signs Chart" class="chart-image" />
        </body>
        </html>
    `;
    
    printDocument.write(printHTML);
    printDocument.close();
    
    printWindow.onload = function() {
        setTimeout(function() {
            printWindow.print();
            printWindow.close();
        }, 500);
    };
}