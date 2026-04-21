// PACU/FCC Chart Data and Functions

// Vital signs data from April 21, 2025 (PACU/FCC period)
const pacuFccVitalSignsData = {
    timeLabels: [
        '18:30', '18:35', '18:40', '18:45', '19:00', 
        '19:15', '19:30', '19:45', '20:00', '20:07', '20:15', '20:26', '20:30', '20:35', '20:40', '20:48', 
        '20:52', '20:53', '20:57', '21:03', '21:05', '21:06', '21:07',
        '21:08', '21:16', '21:24', '21:29', '21:34', '21:39', '21:44', '21:46', '21:49', '22:10', '22:12', '22:15'
    ],
    
    dataPoints: [
        // Fixed data with corrected Shock Index calculations
        { time: '18:30', systolic: 134, diastolic: 89, hr: 95, map: 104, rr: 16, si: 0.71 },
        { time: '18:35', systolic: 115, diastolic: 80, hr: 94, map: 91, rr: 15, si: 0.82 },
        { time: '18:40', systolic: 110, diastolic: 75, hr: 90, map: 86, rr: 17, si: 0.82 },
        { time: '18:45', systolic: 117, diastolic: 65, hr: 85, map: 82, rr: 17, si: 0.73 },
        { time: '19:00', systolic: 130, diastolic: 83, hr: 102, map: 98, rr: 15, si: 0.78 },
        { time: '19:15', systolic: 134, diastolic: 77, hr: 104, map: 96, rr: 18, si: 0.78 },
        { time: '19:30', systolic: 122, diastolic: 80, hr: 84, map: 94, rr: 16, si: 0.69 },
        { time: '19:45', systolic: 126, diastolic: 78, hr: 88, map: 94, rr: 16, si: 0.70 },
        // Gap: no measurements taken from 20:00-20:30
        { time: '20:00', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:07', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:15', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:26', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:30', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:35', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:40', systolic: 106, diastolic: 57, hr: 102, map: 74, rr: 19, si: 0.96 },
        { time: '20:48', systolic: 122, diastolic: 52, hr: 126, map: null, rr: null, si: 1.03 },
        { time: '20:52', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '20:53', systolic: 100, diastolic: 59, hr: 122, map: null, rr: null, si: 1.22 },
        { time: '20:57', systolic: 96, diastolic: 53, hr: 137, map: null, rr: null, si: 1.43 },
        { time: '21:03', systolic: 71, diastolic: 42, hr: 137, map: null, rr: null, si: 1.93 },
        { time: '21:05', systolic: 67, diastolic: 36, hr: null, map: null, rr: null, si: null },
        { time: '21:06', systolic: 68, diastolic: 41, hr: null, map: null, rr: null, si: null },
        { time: '21:07', systolic: null, diastolic: null, hr: null, map: null, rr: null, si: null },
        { time: '21:08', systolic: 102, diastolic: 66, hr: 129, map: null, rr: null, si: 1.26 },
        { time: '21:16', systolic: 108, diastolic: 62, hr: 136, map: null, rr: null, si: 1.26 },
        { time: '21:24', systolic: 102, diastolic: 58, hr: 151, map: null, rr: null, si: 1.48 },
        { time: '21:29', systolic: 95, diastolic: 58, hr: 151, map: null, rr: null, si: 1.59 },
        { time: '21:34', systolic: 96, diastolic: 56, hr: 152, map: null, rr: null, si: 1.58 },
        { time: '21:39', systolic: 112, diastolic: 58, hr: 153, map: null, rr: null, si: 1.37 },
        { time: '21:44', systolic: 97, diastolic: 51, hr: 158, map: null, rr: null, si: 1.63 },
        { time: '21:46', systolic: 93, diastolic: 54, hr: null, map: null, rr: null, si: null },
        { time: '21:49', systolic: 79, diastolic: 50, hr: 150, map: null, rr: null, si: 1.90 },
        { time: '22:10', systolic: 61, diastolic: 42, hr: null, map: null, rr: null, si: null },
        { time: '22:12', systolic: 59, diastolic: 49, hr: null, map: null, rr: null, si: null },
        { time: '22:15', systolic: 70, diastolic: 60, hr: 147, map: null, rr: null, si: 2.10 },
    ]
};

// MAP (calculated) data for PACU/FCC period - calculated from systolic/diastolic
const pacuFccMapCalculatedData = [
    { time: '20:40', map: 74 },
    { time: '20:48', map: 75 },
    { time: '20:53', map: 73 },
    { time: '20:57', map: 67 },
    { time: '21:03', map: 52 },
    { time: '21:05', map: 46 },
    { time: '21:06', map: 50 },
    { time: '21:08', map: 78 },
    { time: '21:16', map: 77 },
    { time: '21:24', map: 73 },
    { time: '21:29', map: 70 },
    { time: '21:34', map: 69 },
    { time: '21:39', map: 76 },
    { time: '21:44', map: 66 },
    { time: '21:46', map: 67 },
    { time: '21:49', map: 60 }
];

// Medical actions data for PACU/FCC
const pacuFccMedicalActions = [
    { time: '18:30', doctor: 'Breedlove', action: 'midline, firm, scant' },
    { time: '18:45', doctor: 'Breedlove', action: 'midline, firm, scant' },
    { time: '19:00', doctor: 'Breedlove', action: 'midline, firm, scant' },
    { time: '19:15', doctor: 'Crawford', action: 'uterus, midline, firm, small to moderate' },
    { time: '19:30', doctor: 'Crawford', action: 'midline, firm, moderate, clots' },
    { time: '19:45', doctor: 'Crawford', action: 'uterus, midline, firm, small to moderate' },
    { time: '20:00', doctor: 'Crawford', action: 'uterus, midline, firm, small to moderate' },
    { time: '20:07', doctor: 'QBL 133ml', action: 'Crawford' },
    { time: '20:35', doctor: 'Williams', action: 'uterus firm, light, clots' }
];

// Notes data for PACU/FCC
const pacuFccNotes = [
    { time: '20:07', note: 'No vitals connected', comment: 'Urine bag empty or nearly empty', link: 'https://drive.google.com/file/d/1-gvFQ-26sS4R5gIw7YBvMBdxRgYrPozU/view?usp=drive_link' },
    { time: '20:26', note: 'I feel liquid (FCC)', link: 'https://drive.google.com/file/d/14WZR78yz0toGItTbylNjwqcQbIT7E8Bu/view?usp=drive_link' },
    { time: '20:52', note: 'First call to attending physician', comment: 'Order: Methergine and CBC STAT' },
    { time: '21:03', note: 'Second call to attending physician', comment: 'Order: Cytotec and TXA' },
    { time: '21:20', note: 'Labs collected', comment: 'CBC, DIC panel' },
    { time: '21:37', note: 'Blood ready' },
    { time: '21:39', note: 'Labs results', fullNote: 'Labs results', link: 'images/Laboratory.jpeg', linkType: 'image' },
    { time: '21:58', note: 'Consent for D&C signed' }
];

// Orders data for PACU/FCC
const pacuFccOrders = [
    { time: '21:07', note: 'Order placed', comment: 'by attending physician.', link: '#order-2107', linkType: 'anchor' },
    { time: '21:20', note: 'Crossmatch' },
    { time: '21:20', note: 'Order placed', comment: 'by attending physician.', link: '#order-2120', linkType: 'anchor' },
    { time: '21:55', note: 'D&C ordered', fullNote: 'Ordered Dilation & Curettage' }
];

// Interventions data for PACU/FCC
const pacuFccInterventions = [
    { time: '21:05', note: 'Methergine', fullNote: 'Methergine administered' },
    { time: '21:12', note: 'Cytotec', fullNote: 'Cytotec administered' },
    { time: '21:15', note: 'TXA', fullNote: 'TXA administered' }
];

// Create medical action flags for PACU/FCC
function createPacuFccMedicalActionFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = selectedVital === 'si' ? -0.5 : -13;
    let actionIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    pacuFccMedicalActions.forEach((action) => {
        const actionMinutes = timeToMinutes(action.time);
        if (actionMinutes >= fromMinutes && actionMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(action.time),
                y: yOffset - (selectedVital === 'si' ? (actionIndex % 3) * 0.2 : (actionIndex % 2.8) * 8),
                doctor: action.doctor,
                fullAction: `${action.doctor} (${action.action})`,
                time: action.time
            });
            actionIndex++;
        }
    });
    
    return flags;
}

// Create notes flags for PACU/FCC
function createPacuFccNotesFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = selectedVital === 'si' ? -1 : -35;
    let noteIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    pacuFccNotes.forEach((note) => {
        const noteMinutes = timeToMinutes(note.time);
        if (noteMinutes >= fromMinutes && noteMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(note.time),
                y: yOffset - (selectedVital === 'si' ? (noteIndex % 3) * 0.3 : (noteIndex % 3) * 10),
                note: note.note,
                comment: note.comment,
                link: note.link,
                linkType: note.linkType,
                fullNote: `${note.note}${note.comment ? ': ' + note.comment : ''}`,
                time: note.time
            });
            noteIndex++;
        }
    });
    
    return flags;
}

// Create orders flags for PACU/FCC
function createPacuFccOrdersFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = selectedVital === 'si' ? -1.5 : -58;
    let orderIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    pacuFccOrders.forEach((order) => {
        const orderMinutes = timeToMinutes(order.time);
        if (orderMinutes >= fromMinutes && orderMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(order.time),
                y: yOffset - (selectedVital === 'si' ? (orderIndex % 2) * 0.2 : (orderIndex % 2) * 10),
                note: order.note,
                comment: order.comment,
                link: order.link,
                linkType: order.linkType,
                fullNote: `${order.note}${order.comment ? ': ' + order.comment : ''}`,
                time: order.time
            });
            orderIndex++;
        }
    });
    
    return flags;
}

// Create interventions flags for PACU/FCC
function createPacuFccInterventionsFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = selectedVital === 'si' ? -2 : -70;
    let interventionIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    pacuFccInterventions.forEach((intervention) => {
        const interventionMinutes = timeToMinutes(intervention.time);
        if (interventionMinutes >= fromMinutes && interventionMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(intervention.time),
                y: yOffset - (selectedVital === 'si' ? (interventionIndex % 3) * 0.2 : (interventionIndex % 3) * 10),
                note: intervention.note,
                comment: intervention.comment,
                link: intervention.link,
                fullNote: `${intervention.note}${intervention.comment ? ': ' + intervention.comment : ''}`,
                time: intervention.time
            });
            interventionIndex++;
        }
    });
    
    return flags;
}

// Create MAP (calculated) flags for PACU/FCC
function createMapCalculatedFlags(mapData, timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    let yOffset = selectedVital === 'si' ? -0.4 : -10;

    mapData.forEach((item, index) => {
        const itemTimeMinutes = timeToMinutes(item.time);
        
        if (itemTimeMinutes >= fromMinutes && itemTimeMinutes <= toMinutes) {
            const x = itemTimeMinutes;
            const y = selectedVital === 'map' ? item.map : yOffset;
            
            flags.push({
                x: x,
                y: y,
                time: item.time,
                map: item.map,
                label: `MAP: ${item.map}`,
                fullNote: `MAP (calculated): ${item.map}`
            });
        }
    });
    
    return flags;
}