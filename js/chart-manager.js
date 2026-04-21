// Chart creation and management functions

// Custom plugin to draw time bar at zero axis with PACU/FCC zones
const timeBarPlugin = {
    id: 'timeBar',
    beforeDatasetsDraw: function(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;
        
        // Draw time bar at y=0
        const yZero = yAxis.getPixelForValue(0);
        const barHeight = 26;
        
        ctx.save();
        
        // Get chart type from options
        const chartType = chart.options.plugins.timeBar?.chartType || 'pacu-fcc';
        
        if (chartType === 'pacu-fcc') {
            // Define time zones for PACU/FCC with extension
            const pacuEndTime = timeToMinutes('20:25');
            const fccStartTime = timeToMinutes('20:25');
            const fccExtendedStartTime = timeToMinutes('22:10');
            
            const pacuEndX = xAxis.getPixelForValue(pacuEndTime);
            const fccStartX = xAxis.getPixelForValue(fccStartTime);
            const fccExtendedStartX = xAxis.getPixelForValue(fccExtendedStartTime);
            
            // Draw PACU zone (18:30-20:25)
            ctx.fillStyle = '#74A3D7';
            const pacuWidth = Math.max(0, pacuEndX - chartArea.left);
            if (pacuWidth > 0) {
                ctx.fillRect(chartArea.left, yZero - barHeight/2, pacuWidth, barHeight);
            }
            
            // Draw FCC zone (20:25-22:10)
            ctx.fillStyle = '#56597A';
            const fccWidth = Math.max(0, fccExtendedStartX - fccStartX);
            if (fccWidth > 0 && fccStartX <= chartArea.right) {
                ctx.fillRect(fccStartX, yZero - barHeight/2, fccWidth, barHeight);
            }
            
            // Draw extended zone (22:10-22:15) with different color
            ctx.fillStyle = '#8B4A6B'; // Different color for the extension period
            const extendedWidth = Math.max(0, chartArea.right - fccExtendedStartX);
            if (extendedWidth > 0 && fccExtendedStartX <= chartArea.right) {
                ctx.fillRect(fccExtendedStartX, yZero - barHeight/2, extendedWidth, barHeight);
            }
        } else if (chartType === 'operation-room') {
            // Define time zones for Operation Room/ICU
            const criticalUnitStartTime = timeToMinutes('23:50');
            
            const criticalUnitStartX = xAxis.getPixelForValue(criticalUnitStartTime);
            
            // Draw Operation Room zone (22:10-23:49)
            ctx.fillStyle = '#74A3D7';
            const orWidth = Math.max(0, criticalUnitStartX - chartArea.left);
            if (orWidth > 0) {
                ctx.fillRect(chartArea.left, yZero - barHeight/2, orWidth, barHeight);
            }
            
            // Draw ICU zone (23:50-00:40+)
            ctx.fillStyle = '#56597A';
            const cuWidth = Math.max(0, chartArea.right - criticalUnitStartX);
            if (cuWidth > 0 && criticalUnitStartX <= chartArea.right) {
                ctx.fillRect(criticalUnitStartX, yZero - barHeight/2, cuWidth, barHeight);
            }
        }
        
        // Draw border around entire bar
        ctx.strokeStyle = '#7f7f7f';
        ctx.lineWidth = 1;
        ctx.strokeRect(chartArea.left, yZero - barHeight/2, chartArea.width, barHeight);
        
        // Draw time labels based on chart type
        let timeLabels = [];
        if (chartType === 'pacu-fcc') {
            timeLabels = ['18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15'];
        } else if (chartType === 'operation-room') {
            timeLabels = ['22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45', '00:00', '00:15', '00:30', '00:45'];
        }
        
        // Get time format preference from chart options
        const use24HourFormat = chart.options.plugins.timeBar?.use24HourFormat !== false;
        
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        timeLabels.forEach(time => {
            const xPos = xAxis.getPixelForValue(timeToMinutes(time));
            if (xPos >= chartArea.left && xPos <= chartArea.right) {
                const displayTime = formatTime(time, use24HourFormat);
                ctx.fillText(displayTime, xPos, yZero);
            }
        });
        
        ctx.restore();
    }
};

// Custom plugin to draw normal range text
const normalRangeTextPlugin = {
    id: 'normalRangeText',
    beforeDraw: function(chart) {
        const currentVital = chart.options.plugins.normalRangeText?.selectedVital;
        if (!currentVital) return;
        
        const range = normalRanges[currentVital];
        if (!range) return;
        
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;
        
        // Get time range from chart options - use actual chart visible time range
        const chartType = chart.options.plugins.timeBar?.chartType || 'pacu-fcc';
        // For both chart types, use actual chart visible time range (considering filter)
        let startTime = chart.scales.x.min + 5; // Remove the padding added in scales config
        let endTime = chart.scales.x.max - 5;   // Remove the padding added in scales config
        
        const midTime = (startTime + endTime) / 2;
        const midValue = (range.min + range.max) / 2;
        
        const xPos = xAxis.getPixelForValue(midTime);
        const yPos = yAxis.getPixelForValue(midValue);
        
        if (xPos >= chartArea.left && xPos <= chartArea.right && 
            yPos >= chartArea.top && yPos <= chartArea.bottom) {
            
            ctx.save();
            ctx.font = 'normal 14px Arial';
            
            // Draw background for text
            const vitalLabels = {
                'hr': 'HEART RATE',
                'systolic': 'SYSTOLIC BP',
                'diastolic': 'DIASTOLIC BP',
                'map': 'MAP',
                'rr': 'RESPIRATORY RATE',
                'si': 'SHOCK INDEX'
            };
            const vitalLabel = vitalLabels[currentVital] || 'VITAL SIGNS';
            const normalRangeText = `${vitalLabel} NORMAL RANGE`;
            const textWidth = ctx.measureText(normalRangeText).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(xPos - textWidth/2 - 8, yPos - 10, textWidth + 16, 20);
            
            // Draw text
            ctx.fillStyle = 'rgba(39, 174, 96, 0.5)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(normalRangeText, xPos, yPos);
            
            ctx.restore();
        }
    }
};

// Custom plugin to draw thick time range bars
const timeRangeBarPlugin = {
    id: 'timeRangeBar',
    afterDatasetsDraw: function(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const yAxis = chart.scales.y;
        const xAxis = chart.scales.x;
        
        ctx.save();
        
        // Find time range datasets
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            if ((dataset.label === 'Surgical Procedures' || dataset.label === 'Nurses Assessments') && !dataset.hidden) {
                const timeRanges = [];
                
                // Group start and end points into ranges
                dataset.data.forEach((point, index) => {
                    if (point.isRangeStart) {
                        const endPoint = dataset.data.find(p => p.isRangeEnd && p.y === point.y);
                        if (endPoint) {
                            timeRanges.push({
                                startX: point.x,
                                endX: endPoint.x,
                                y: point.y,
                                action: point.fullAction || 'D&C'
                            });
                        }
                    }
                });
                
                // Draw thick bars for each time range
                timeRanges.forEach(range => {
                    const startPixel = xAxis.getPixelForValue(range.startX);
                    const endPixel = xAxis.getPixelForValue(range.endX);
                    const yPixel = yAxis.getPixelForValue(range.y);
                    
                    if (startPixel >= chartArea.left && endPixel <= chartArea.right) {
                        const barWidth = endPixel - startPixel;
                        const barHeight = 20;
                        
                        // Draw thick bar
                        ctx.fillStyle = 'rgba(230, 126, 34, 1)';
                        ctx.fillRect(startPixel, yPixel - barHeight/2, barWidth, barHeight);
                        
                        // Draw border
                        ctx.strokeStyle = '#d35400';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(startPixel, yPixel - barHeight/2, barWidth, barHeight);
                        
                        // Draw text inside
                        const actionText = range.action.split('(')[1]?.replace(')', '');
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 12px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        const centerX = startPixel + barWidth/2;
                        ctx.fillText(actionText, centerX, yPixel);
                    }
                });
            }
        });
        
        ctx.restore();
    }
};

// Register plugins
Chart.register(timeBarPlugin);
Chart.register(normalRangeTextPlugin);
Chart.register(timeRangeBarPlugin);

// Create chart function
function createChart(chartId, vitalSignsData, medicalActionsFunc, notesFunc, ordersFunc, transfusionFunc, vasopressorsFunc, interventionsFunc, drSmithMTPFunc, chartType = 'pacu-fcc', defaultTimeFrom = '18:30', defaultTimeTo = '22:10') {
    const ctx = document.getElementById(chartId).getContext('2d');
    let selectedVital = 'hr';
    let selectedTimeFrom = defaultTimeFrom;
    let selectedTimeTo = defaultTimeTo;
    let use24HourFormat = true; // Default to 24-hour format
    
    const vitalLabels = {
        'hr': 'Heart Rate',
        'systolic': 'Systolic BP',
        'diastolic': 'Diastolic BP',
        'map': 'MAP',
        'rr': 'Respiratory Rate',
        'si': 'Shock Index'
    };
    
    function createChartInstance() {
        const flagResult = createCombinedFlags(vitalSignsData.dataPoints, selectedVital, selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels);
        const flagData = flagResult.flags;
        const medicalFlags = medicalActionsFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital);
        const notesFlags = notesFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital);
        const ordersFlags = ordersFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital);
        const transfusionFlags = transfusionFunc ? transfusionFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital) : [];
        const vasopressorsFlags = vasopressorsFunc ? vasopressorsFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital) : [];
        const interventionsFlags = interventionsFunc ? interventionsFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital) : [];
        const drSmithMTPFlags = drSmithMTPFunc ? drSmithMTPFunc(selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital) : [];
        
        // Create MAP (calculated) flags for PACU/FCC chart
        const mapCalculatedFlags = (chartType === 'pacu-fcc' && typeof pacuFccMapCalculatedData !== 'undefined') ? 
            createMapCalculatedFlags(pacuFccMapCalculatedData, selectedTimeFrom, selectedTimeTo, vitalSignsData.timeLabels, selectedVital) : [];
        
        const normalRangeDatasets = createNormalRangeDataset(selectedVital, selectedTimeFrom, selectedTimeTo);
        
        // Calculate dynamic Y axis max value based on current vital sign and data
        function calculateDynamicYMax() {
            if (selectedVital === 'si') {
                return 2.5;
            }
            
            let maxValue = 0;
            const fromMinutes = timeToMinutes(selectedTimeFrom);
            const toMinutes = timeToMinutes(selectedTimeTo);
            
            // Check only the selected vital sign data in current time range
            vitalSignsData.dataPoints.forEach(point => {
                const pointMinutes = timeToMinutes(point.time);
                if (pointMinutes >= fromMinutes && pointMinutes <= toMinutes) {
                    const value = point[selectedVital];
                    if (value !== null && value !== undefined) {
                        maxValue = Math.max(maxValue, value);
                    }
                }
            });
            
            // Add +10 to max value, minimum 180
            return Math.max(30, maxValue + 20);
        }
        
        const DATASET_STYLES_PACU_FCC = {
            'Nurses Assessments': { bg: '#d35400', border: '#ffffff', point: 'rect', radius: 15 },
            'Notes': { bg: '#7d3c98', border: '#ffffff', point: 'rect', radius: 10 },
            'Orders': { bg: '#27ae60', border: '#ffffff', point: 'rect', radius: 10 },
            'Interventions': { bg: '#c60098', border: '#ffffff', point: 'rect', radius: 10 },
        };
        
        const DATASET_STYLES_OPERATION_ROOM = {
            'Surgical Procedures': { bg: '#d35400', border: '#ffffff', point: 'rect', radius: 1 },
            'Notes': { bg: '#7d3c98', border: '#ffffff', point: 'rect', radius: 10 },
            'Orders': { bg: '#27ae60', border: '#ffffff', point: 'rect', radius: 10 },
            'Transfusion': { bg: '#e74c3c', border: '#ffffff', point: 'rect', radius: 10 },
            'Interventions': { bg: '#c60098', border: '#ffffff', point: 'rect', radius: 10 },
            'Vasopressors': { bg: '#5b5d9d', border: '#ffffff', point: 'rect', radius: 10 },
            'Dr. Brown MTP': { bg: '#3a3a3a', border: '#ffffff', point: 'rect', radius: 8 }
        };
        
        const DATASET_STYLES = chartType === 'operation-room' ? DATASET_STYLES_OPERATION_ROOM : DATASET_STYLES_PACU_FCC;
        
        function createDataset(label, data, customStyle = {}) {
            const style = DATASET_STYLES[label] || {};
            return {
                label,
                data,
                backgroundColor: style.bg || '#3498db',
                borderColor: style.border || '#2980b9',
                borderWidth: 2,
                pointRadius: style.radius || 8,
                pointHitRadius: 16,
                pointHoverRadius: (style.radius || 8) + 3,
                pointStyle: style.point || 'circle',
                showLine: false,
                ...customStyle
            };
        }
        const datasets = [];
        
        // Zone legend datasets
        if (chartType === 'pacu-fcc') {
            datasets.push(
                { label: 'PACU', data: [], backgroundColor: '#74A3D7', borderColor: '#74A3D7', borderWidth: 2, pointRadius: 0, showLine: false, order: 1 },
                { label: 'FCC', data: [], backgroundColor: '#56597A', borderColor: '#56597A', borderWidth: 2, pointRadius: 0, showLine: false, order: 2 }
            );
        } else {
            datasets.push(
                { label: 'Operation Room', data: [], backgroundColor: '#74A3D7', borderColor: '#74A3D7', borderWidth: 2, pointRadius: 0, showLine: false, order: 1 },
                { label: 'ICU', data: [], backgroundColor: '#56597A', borderColor: '#56597A', borderWidth: 2, pointRadius: 0, showLine: false, order: 2 }
            );
        }
        
        // Normal range and callout lines
        if (normalRangeDatasets?.length) datasets.push(...normalRangeDatasets);
        
        // Filter out only time range parts from medical callout lines (keep start/end points)
        const medicalFlagsForCallout = medicalFlags.filter(flag => !flag.isLinePart);
        
        // Calculate Y-axis range for dynamic callout line offsets
        const yMin = selectedVital === 'si' ? -2.5 : -100;
        const yMax = selectedVital === 'si' ? 2.5 : calculateDynamicYMax();
        
        const calloutLines = [
            { label: 'Callout Lines', data: (selectedVital === 'si' || selectedVital === 'map') ? [] : createCalloutLines(flagData, yMin, yMax, selectedVital), color: '#3498db', hidden: selectedVital === 'si' || selectedVital === 'map' },
            { label: 'Medical Callout Lines', data: createMedicalCalloutLines(medicalFlagsForCallout, yMin, yMax, selectedVital), color: '#e67e22' },
            { label: 'Notes Callout Lines', data: createMedicalCalloutLines(notesFlags, yMin, yMax, selectedVital), color: '#8e44ad' },
            { label: 'Orders Callout Lines', data: createMedicalCalloutLines(ordersFlags, yMin, yMax, selectedVital), color: '#2ecc71', hidden: chartType === 'operation-room' },
            { label: 'Transfusion Callout Lines', data: createMedicalCalloutLines(transfusionFlags, yMin, yMax, selectedVital), color: '#c0392b' },
            { label: 'Interventions Callout Lines', data: createMedicalCalloutLines(interventionsFlags, yMin, yMax, selectedVital), color: 'rgb(198, 0, 152)' },
            { label: 'Vasopressors Callout Lines', data: createMedicalCalloutLines(vasopressorsFlags, yMin, yMax, selectedVital), color: '#5b5d9d' },
            { label: 'Dr. Brown MTP Callout Lines', data: createMedicalCalloutLines(drSmithMTPFlags, yMin, yMax, selectedVital), color: '#3a3a3a', hidden: true }
        ];
        
        calloutLines.forEach(line => {
            datasets.push({
                label: line.label,
                data: line.data,
                borderColor: line.color,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                showLine: true,
                spanGaps: false,
                hidden: line.hidden || false
            });
        });
        
        // Main datasets
        datasets.push(
            {
                label: vitalLabels[selectedVital] || 'Vital Signs',
                data: flagData,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 2,
                pointRadius: 10,
                pointHitRadius: 20,
                pointHoverRadius: 12,
                pointStyle: 'circle',
                showLine: selectedVital === 'si' || selectedVital === 'map',
                tension: (selectedVital === 'si' || selectedVital === 'map') ? 0.1 : 0,
                spanGaps: false
            }
        );
        
        // Add MAP (calculated) dataset right after main MAP for PACU/FCC chart  
        if (chartType === 'pacu-fcc' && mapCalculatedFlags && mapCalculatedFlags.length > 0) {
            datasets.push({
                label: 'MAP (calculated)',
                data: mapCalculatedFlags,
                backgroundColor: '#e67e22',
                borderColor: '#d35400',
                borderWidth: 2,
                pointRadius: 10,
                pointHitRadius: 20,
                pointHoverRadius: 12,
                pointStyle: 'circle',
                showLine: selectedVital === 'map',
                tension: selectedVital === 'map' ? 0.1 : 0,
                spanGaps: false,
                hidden: selectedVital !== 'map'
            });
        }
        
        datasets.push(
            createDataset(chartType === 'operation-room' ? 'Surgical Procedures' : 'Nurses Assessments', medicalFlags, {
                showLine: false, // Hide line, plugin will draw thick bars
                tension: 0,
                spanGaps: false,
                borderWidth: 2
            }),
            createDataset('Notes', notesFlags),
            createDataset('Orders', ordersFlags, { hidden: chartType === 'operation-room' })
        );
        
        // Add Interventions for PACU/FCC or Transfusion for Operation Room  
        if (chartType === 'operation-room') {
            datasets.push(createDataset('Transfusion', transfusionFlags));
            if (interventionsFlags && interventionsFlags.length > 0) {
                datasets.push(createDataset('Interventions', interventionsFlags));
            }
        } else {
            datasets.push(createDataset('Interventions', interventionsFlags));
        }
        
        // Add Vasopressors dataset only if we have vasopressorsFlags
        if (vasopressorsFlags && vasopressorsFlags.length > 0) {
            datasets.push(createDataset('Vasopressors', vasopressorsFlags));
        }
        
        // Add Dr. Brown MTP dataset only if we have drSmithMTPFlags
        if (drSmithMTPFlags && drSmithMTPFlags.length > 0) {
            datasets.push(createDataset('Dr. Brown MTP', drSmithMTPFlags, { hidden: true }));
        }
        
        return new Chart(ctx, {
            type: 'scatter',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    timeBar: {
                        chartType: chartType,
                        use24HourFormat: use24HourFormat
                    },
                    normalRangeText: {
                        selectedVital: selectedVital
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyleWidth: 18,
                            padding: 20,
                            font: { size: 13 },
                            filter: function(item) {
                                if (item.text.includes('PACU') || item.text.includes('FCC') || item.text.includes('Operation Room') || item.text.includes('ICU')) {
                                    return true;
                                }
                                return item.text !== 'Callout Lines' && 
                                       item.text !== 'Medical Callout Lines' && 
                                       item.text !== 'Notes Callout Lines' && 
                                       item.text !== 'Orders Callout Lines' && 
                                       item.text !== 'Interventions Callout Lines' && 
                                       item.text !== 'Transfusion Callout Lines' && 
                                       item.text !== 'Vasopressors Callout Lines' && 
                                       item.text !== 'Dr. Brown MTP Callout Lines' && 
                                       item.text !== 'Normal Range Label' &&
                                       !item.text.includes('Upper') &&
                                       !item.text.includes('Lower') &&
                                       !item.text.startsWith('Normal');
                            }
                        },
                        onClick: function(evt, legendItem, legend) {
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                            const dataset = chart.data.datasets[datasetIndex];
                            const datasetLabel = dataset.label;
                            
                            // Toggle main dataset visibility
                            dataset.hidden = !dataset.hidden;
                            
                            // Special handling for Dr. Brown MTP to update Y-axis
                            if (datasetLabel === 'Dr. Brown MTP') {
                                const newMin = selectedVital === 'si' ? -2.5 : (!dataset.hidden ? -150 : -100);
                                chart.options.scales.y.min = newMin;
                            }
                            
                            // Find and toggle corresponding callout lines
                            const calloutLineLabels = {
                                'Surgical Procedures': 'Medical Callout Lines',
                                'Nurses Assessments': 'Medical Callout Lines',
                                'Notes': 'Notes Callout Lines',
                                'Orders': 'Orders Callout Lines',
                                'Transfusion': 'Transfusion Callout Lines',
                                'Interventions': 'Interventions Callout Lines',
                                'Vasopressors': 'Vasopressors Callout Lines',
                                'Dr. Brown MTP': 'Dr. Brown MTP Callout Lines'
                            };
                            
                            const calloutLabel = calloutLineLabels[datasetLabel];
                            if (calloutLabel) {
                                const calloutDataset = chart.data.datasets.find(ds => ds.label === calloutLabel);
                                if (calloutDataset) {
                                    calloutDataset.hidden = dataset.hidden;
                                }
                            }
                            
                            // For Vital Signs, handle main callout lines
                            if (Object.values(vitalLabels).includes(datasetLabel)) {
                                const mainCalloutDataset = chart.data.datasets.find(ds => ds.label === 'Callout Lines');
                                if (mainCalloutDataset) {
                                    mainCalloutDataset.hidden = dataset.hidden;
                                }
                            }
                            
                            chart.update();
                        }
                    },
                    datalabels: {
                        display: (context) => {
                            // Hide all labels for Surgical Procedures in operation room
                            if (context.dataset.label === 'Surgical Procedures') {
                                return false;
                            }
                            // Hide labels for time range start/end points (they should look like Shock Index)
                            if (context.dataset.label === 'Nurses Assessments' && context.raw && (context.raw.isRangeStart || context.raw.isRangeEnd)) {
                                return false;
                            }
                            return [vitalLabels[selectedVital], 'Nurses Assessments', 'Notes', 'Orders', 'Interventions', 'Transfusion', 'Vasopressors', 'Dr. Brown MTP', 'MAP (calculated)'].includes(context.dataset.label);
                        },
                        backgroundColor: (context) => {
                            if (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') return 'transparent';
                            const styles = DATASET_STYLES[context.dataset.label];
                            return styles?.bg || 'rgba(255, 255, 255, 0.9)';
                        },
                        borderColor: (context) => {
                            if (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') return 'transparent';
                            const styles = DATASET_STYLES[context.dataset.label];
                            return styles?.border || '#2980b9';
                        },
                        borderWidth: (context) => (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') ? 0 : 1,
                        borderRadius: 4,
                        color: (context) => {
                            if (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') return '#2c3e50';
                            return DATASET_STYLES[context.dataset.label] ? '#ffffff' : '#2c3e50';
                        },
                        font: { size: 10, weight: '600' },
                        padding: 6,
                        textAlign: 'center',
                        anchor: (context) => (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') ? 'end' : 'center',
                        align: (context) => (context.dataset.label === vitalLabels[selectedVital] || context.dataset.label === 'MAP (calculated)') ? 'top' : 'center',
                        formatter: function(value, context) {
                            const labelMap = {
                                'Surgical Procedures': value.doctor,
                                'Nurses Assessments': value.doctor,
                                'Notes': value.note || 'No vitals connected',
                                'Orders': value.note || 'Order',
                                'Interventions': value.note || 'Intervention',
                                'Transfusion': value.note || 'Transfusion',
                                'Vasopressors': value.note || 'Vasopressors',
                                'Dr. Brown MTP': value.note || 'MTP',
                                'MAP (calculated)': value.map || value.y
                            };
                            
                            if (context.dataset.label === vitalLabels[selectedVital]) {
                                return value[selectedVital] || value.y;
                            }
                            
                            if (context.dataset.label === 'MAP (calculated)') {
                                return value.map || value.y;
                            }
                            
                            return labelMap[context.dataset.label] || value.shortLabel || 'Vital Signs';
                        }
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        cornerRadius: 6,
                        displayColors: false,
                        position: 'nearest',
                        yAlign: 'top',
                        callbacks: {
                            title: function(tooltipItems) {
                                if (tooltipItems && tooltipItems.length > 0) {
                                    const point = tooltipItems[0];
                                    const dataPoint = point.parsed;
                                    if (point.raw && point.raw.time) {
                                        return `Time: ${formatTime(point.raw.time, use24HourFormat)}`;
                                    }
                                    return `Time: ${formatTime(minutesToTime(dataPoint.x), use24HourFormat)}`;
                                }
                                return '';
                            },
                            label: function(tooltipItem) {
                                const point = tooltipItem.raw;
                                const datasetLabel = tooltipItem.dataset.label;
                                
                                // Skip callout lines completely
                                if (datasetLabel && (
                                    datasetLabel.includes('Callout Lines') || 
                                    datasetLabel === 'Callout Lines' ||
                                    datasetLabel === 'Medical Callout Lines' ||
                                    datasetLabel === 'Notes Callout Lines' ||
                                    datasetLabel === 'Orders Callout Lines' ||
                                    datasetLabel === 'Interventions Callout Lines'
                                )) {
                                    return [];
                                }
                                
                                // For vital signs data points - find complete data for this time
                                // Check if this is a vital signs dataset by checking if datasetLabel matches any vital label
                                const isVitalSignsDataset = Object.values(vitalLabels).includes(datasetLabel);
                                
                                if (isVitalSignsDataset || (point && typeof point === 'object' && (point.systolic !== undefined || point.hr !== undefined || point.map !== undefined || point.rr !== undefined || point.si !== undefined))) {
                                    const timeMinutes = tooltipItem.parsed.x;
                                    const timeString = minutesToTime(timeMinutes);
                                    
                                    // Find complete data for this time - use the passed vitalSignsData parameter
                                    const fullDataPoint = vitalSignsData.dataPoints.find(dp => dp.time === timeString);
                                    
                                    if (fullDataPoint) {
                                        const vitals = [];
                                        if (fullDataPoint.systolic !== null && fullDataPoint.systolic !== undefined) vitals.push(`Systolic BP: ${fullDataPoint.systolic}`);
                                        if (fullDataPoint.diastolic !== null && fullDataPoint.diastolic !== undefined) vitals.push(`Diastolic BP: ${fullDataPoint.diastolic}`);
                                        if (fullDataPoint.hr !== null && fullDataPoint.hr !== undefined) vitals.push(`Heart Rate: ${fullDataPoint.hr}`);
                                        if (fullDataPoint.map !== null && fullDataPoint.map !== undefined) vitals.push(`MAP: ${fullDataPoint.map}`);
                                        if (fullDataPoint.rr !== null && fullDataPoint.rr !== undefined) vitals.push(`RR: ${fullDataPoint.rr}`);
                                        if (fullDataPoint.si !== null && fullDataPoint.si !== undefined) vitals.push(`Shock Index: ${fullDataPoint.si}`);
                                        return vitals.length > 0 ? vitals : [`${datasetLabel}: ${tooltipItem.parsed.y}`];
                                    }
                                    
                                    // Fallback to point data if no full data found
                                    const vitals = [];
                                    if (point && typeof point === 'object') {
                                        if (point.systolic !== null && point.systolic !== undefined) vitals.push(`Systolic BP: ${point.systolic}`);
                                        if (point.diastolic !== null && point.diastolic !== undefined) vitals.push(`Diastolic BP: ${point.diastolic}`);
                                        if (point.hr !== null && point.hr !== undefined) vitals.push(`Heart Rate: ${point.hr}`);
                                        if (point.map !== null && point.map !== undefined) vitals.push(`MAP: ${point.map}`);
                                        if (point.rr !== null && point.rr !== undefined) vitals.push(`RR: ${point.rr}`);
                                        if (point.si !== null && point.si !== undefined) vitals.push(`Shock Index: ${point.si}`);
                                    }
                                    return vitals.length > 0 ? vitals : [`${datasetLabel}: ${tooltipItem.parsed.y}`];
                                }
                                
                                // For data arrays (legacy format)
                                if (point && point.data && Array.isArray(point.data)) {
                                    return point.data;
                                }
                                
                                // For medical actions, notes, orders, interventions, vasopressors
                                if (point && typeof point === 'object') {
                                    if (point.fullAction) {
                                        if (datasetLabel === 'Surgical Procedures') {
                                            return [`Surgical Procedure: ${point.fullAction}`];
                                        } else {
                                            return [`${point.fullAction}`];
                                        }
                                    }
                                    if (point.fullNote) {
                                        if (datasetLabel === 'Notes') {
                                            const noteText = `Note: ${point.fullNote}`;
                                            if (point.link) {
                                                if (point.linkType === 'image') {
                                                    return [noteText, '[Click to open image]'];
                                                } else if (point.linkType === 'video') {
                                                    return [noteText, '[Click to open video]'];
                                                } else if (point.linkType === 'anchor') {
                                                    return [noteText, '[Click to navigate]'];
                                                } else {
                                                    return [noteText, '[Click to open link]'];
                                                }
                                            }
                                            return [noteText];
                                        } else if (datasetLabel === 'Orders') {
                                            const orderText = `Order: ${point.fullNote}`;
                                            if (point.link) {
                                                if (point.linkType === 'anchor') {
                                                    return [orderText, '[Click to navigate]'];
                                                } else {
                                                    return [orderText, '[Click to open link]'];
                                                }
                                            }
                                            return [orderText];
                                        } else if (datasetLabel === 'Interventions') {
                                            return [`Intervention: ${point.fullNote}`];
                                        } else if (datasetLabel === 'Interventions') {
                                            return [`Intervention: ${point.fullNote}`];
                                        } else if (datasetLabel === 'Vasopressors') {
                                            return [`Vasopressor: ${point.fullNote}`];
                                        } else if (datasetLabel === 'Dr. Brown MTP') {
                                            return [`Dr. Smith MTP: ${point.fullNote}`];
                                        } else if (datasetLabel === 'MAP (calculated)') {
                                            return [`MAP (calculated): ${point.map}`];
                                        }
                                    }
                                    if (point.drug) {
                                        return [`Vasopressor: ${point.drug}`];
                                    }
                                    if (point.note) {
                                        return [`${datasetLabel}: ${point.note}`];
                                    }
                                }
                                
                                // Fallback for simple numeric values
                                if (typeof tooltipItem.parsed.y === 'number') {
                                    return [`${datasetLabel}: ${tooltipItem.parsed.y}`];
                                }
                                
                                return [];
                            },
                            filter: function(tooltipItem) {
                                const datasetLabel = tooltipItem.dataset.label;
                                const point = tooltipItem.raw;
                                
                                // Filter out callout lines from tooltip
                                if (datasetLabel && (
                                    datasetLabel.includes('Callout Lines') || 
                                    datasetLabel === 'Callout Lines' ||
                                    datasetLabel === 'Medical Callout Lines' ||
                                    datasetLabel === 'Notes Callout Lines' ||
                                    datasetLabel === 'Orders Callout Lines' ||
                                    datasetLabel === 'Interventions Callout Lines'
                                )) {
                                    return false;
                                }
                                
                                // Filter out hidden line parts for time ranges
                                if (point && point.hidden) {
                                    return false;
                                }
                                
                                return true;
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'xy'
                },
                onClick: function(evt, activeElements) {
                    if (activeElements && activeElements.length > 0) {
                        // Find the first clickable element (not callout lines)
                        let clickableElement = null;
                        let clickableDatasetLabel = null;
                        let clickablePoint = null;
                        
                        for (const element of activeElements) {
                            if (element && this.data && this.data.datasets && this.data.datasets[element.datasetIndex]) {
                                const datasetLabel = this.data.datasets[element.datasetIndex].label;
                                const point = this.data.datasets[element.datasetIndex].data[element.index];
                                
                                // Skip callout lines
                                if (datasetLabel && datasetLabel.includes('Callout Lines')) {
                                    continue;
                                }
                                
                                // Check if this is a clickable dataset
                                if (['Surgical Procedures', 'Notes', 'Orders', 'Interventions', 'Transfusion', 'Vasopressors', 'Dr. Smith MTP', 'MAP (calculated)'].includes(datasetLabel)) {
                                    clickableElement = element;
                                    clickableDatasetLabel = datasetLabel;
                                    clickablePoint = point;
                                    break;
                                }
                            }
                        }
                        
                        if (clickableElement && clickableDatasetLabel && clickablePoint) {
                            if (clickablePoint.link) {
                                if (clickablePoint.linkType === 'image') {
                                    // Open image in GLightbox popup
                                    const lightbox = GLightbox({
                                        elements: [{
                                            'href': clickablePoint.link,
                                            'type': 'image',
                                            'title': clickablePoint.note || 'Image'
                                        }]
                                    });
                                    lightbox.open();
                                } else if (clickablePoint.linkType === 'video') {
                                    // Open video in GLightbox popup
                                    const lightbox = GLightbox({
                                        elements: [{
                                            'href': clickablePoint.link,
                                            'type': 'video',
                                            'title': clickablePoint.note || 'Video'
                                        }]
                                    });
                                    lightbox.open();
                                } else if (clickablePoint.linkType === 'anchor') {
                                    // Navigate to anchor on same page
                                    window.location.href = clickablePoint.link;
                                } else {
                                    // Default behavior - open in new window
                                    window.open(clickablePoint.link, '_blank');
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: false },
                        ticks: { display: false },
                        grid: { display: true, color: '#ecf0f1' },
                        min: timeToMinutes(selectedTimeFrom) - 5,
                        max: timeToMinutes(selectedTimeTo) + 5
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Values', font: { size: 12, weight: '600' } },
                        grid: { display: true, color: 'rgba(231, 233, 237, 1)', lineWidth: 1 },
                        min: selectedVital === 'si' ? -2.5 : -100,
                        max: selectedVital === 'si' ? 2.5 : calculateDynamicYMax(),
                        ticks: selectedVital === 'si' ? {
                            callback: function(value, index, values) {
                                return value;
                            }
                        } : {},
                        ...(selectedVital === 'si' && {
                            afterBuildTicks: (scale) => {
                                const customTicks = [];
                                for (let i = -2.5; i < 0; i += 0.5) {
                                    customTicks.push({ value: i });
                                }
                                for (let i = 0; i <= 2.5; i += 0.5) {
                                    customTicks.push({ value: i });
                                }
                                scale.ticks = customTicks;
                            }
                        })
                    }
                }
            }
        });
    }
    
    return {
        chart: createChartInstance(),
        updateVital: function(vital) {
            selectedVital = vital;
            this.chart.destroy();
            this.chart = createChartInstance();
        },
        updateTimeRange: function(from, to) {
            selectedTimeFrom = from;
            selectedTimeTo = to;
            this.chart.destroy();
            this.chart = createChartInstance();
        },
        updateTimeFormat: function(format24Hour) {
            use24HourFormat = format24Hour;
            this.chart.destroy();
            this.chart = createChartInstance();
        }
    };
}