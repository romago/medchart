// Operation Room Chart Data and Functions

// Vital signs data from April 21, 2025 (Operation Room period)
const operationRoomVitalSignsData = {
    timeLabels: [
        '22:10', '22:12', '22:15', '22:19', '22:20', '22:22', '22:24', '22:25', '22:28', 
        '22:30', '22:35', '22:37', '22:39', '22:40', '22:45', '22:50', '22:51', '22:55', '22:57', 
        '23:00', '23:05', '23:10', '23:15', '23:20', '23:25', '23:30', '23:35', '23:40', '23:45', '23:50', 
        '00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40'
    ],
    
    dataPoints: [
        // Operation room arrival
        { time: '22:10', systolic: 61, diastolic: 42, hr: null, map: 49, rr: null },
        { time: '22:12', systolic: 59, diastolic: 49, hr: null, map: 55, rr: null },
        { time: '22:15', systolic: 70, diastolic: 60, hr: 147, map: 65, rr: null },
        { time: '22:19', systolic: 65, diastolic: 50, hr: null, map: 57, rr: null },
        { time: '22:20', systolic: null, diastolic: null, hr: 121, map: null, rr: null },
        { time: '22:22', systolic: 74, diastolic: 51, hr: null, map: 60, rr: null },
        { time: '22:24', systolic: 62, diastolic: 54, hr: null, map: 59, rr: null },
        { time: '22:25', systolic: null, diastolic: null, hr: 111, map: null, rr: null },
        { time: '22:28', systolic: 67, diastolic: 52, hr: null, map: 59, rr: null },
        { time: '22:30', systolic: null, diastolic: null, hr: 121, map: null, rr: null },
        { time: '22:35', systolic: null, diastolic: null, hr: 127, map: null, rr: null },
        { time: '22:37', systolic: 31, diastolic: 15, hr: null, map: 19, rr: null },
        { time: '22:39', systolic: 60, diastolic: 48, hr: null, map: 54, rr: null },
        { time: '22:40', systolic: null, diastolic: null, hr: 149, map: null, rr: null },
        { time: '22:45', systolic: null, diastolic: null, hr: 152, map: null, rr: null },
        { time: '22:50', systolic: null, diastolic: null, hr: 138, map: null, rr: null },
        { time: '22:51', systolic: 67, diastolic: 52, hr: null, map: 57, rr: null },
        { time: '22:55', systolic: null, diastolic: null, hr: 113, map: null, rr: null },
        { time: '22:57', systolic: null, diastolic: null, hr: null, map: null, rr: null },
        { time: '23:00', systolic: null, diastolic: null, hr: 98, map: null, rr: null },
        { time: '23:05', systolic: null, diastolic: null, hr: 115, map: null, rr: null },
        { time: '23:10', systolic: null, diastolic: null, hr: 121, map: null, rr: null },
        // ABP monitoring starts
        { time: '23:15', systolic: 122, diastolic: 85, hr: 129, map: 102, rr: null },
        { time: '23:20', systolic: 106, diastolic: 74, hr: 126, map: 87, rr: null },
        { time: '23:25', systolic: 122, diastolic: 84, hr: 123, map: 99, rr: null },
        { time: '23:30', systolic: 129, diastolic: 84, hr: 128, map: 103, rr: null },
        { time: '23:35', systolic: 144, diastolic: 91, hr: 127, map: 114, rr: null },
        // Critical Unit
        { time: '23:50', systolic: 161, diastolic: 93, hr: 107, map: 121, rr: 23 },
        { time: '00:00', systolic: 181, diastolic: 98, hr: 102, map: 124, rr: 19 },
        { time: '00:15', systolic: 173, diastolic: 92, hr: 82, map: 126, rr: 18 },
        { time: '00:30', systolic: 195, diastolic: 108, hr: 89, map: 146, rr: 18 },
        { time: '00:45', systolic: 171, diastolic: 102, hr: 78, map: 130, rr: 18 }
    ]
};

// Medical actions data for Operation Room
const operationRoomMedicalActions = [
    { time: '22:25-22:40', doctor: 'Attending Physician', action: 'D&C 15 min', timeRange: true, startTime: '22:25', endTime: '22:40' },
    { time: '22:43-23:22', doctor: 'Attending Physician', action: 'Hysterectomy 39 min', timeRange: true, startTime: '22:43', endTime: '23:22' },
];

// Notes data for Operation Room
const operationRoomNotes = [
    { time: '22:24', note: 'Critical DIC panel report' },
    { time: '23:39', note: 'Transfer to ICU' },
    { time: '23:13', note: 'Arterial line placed' }
];

// Orders data for Operation Room
const operationRoomOrders = [
    { time: '22:12', note: 'Crossmatch' },
    { time: '22:15', note: 'MTP ordered' },
    { time: '22:17', note: 'Crossmatch' },
    { time: '22:53', note: 'Crossmatch' },
    { time: '23:15', note: 'Crossmatch' }
];

// Transfusion data for Operation Room
const operationRoomTransfusion = [
    { time: '22:19', note: '1 unit scanned', fullNote: '1 unit scanned (RBC)' },
    { time: '22:57', note: '5 units scanned', fullNote: '5 units scanned (RBC + Platelets)' },
    { time: '23:13', note: '5 units scanned', fullNote: '5 units scanned (Plasma + Cryoprecipitate): 4 units Plasma + 1 unit Cryoprecipitate' },
    { time: '23:22', note: '5 units scanned', fullNote: '5 units scanned (RBC + Platelets): 4 RBC + 1 platelet' },
    { time: '23:34', note: '3 units scanned', fullNote: '3 units scanned (Plasma)' },
    { time: '23:43', note: '1 unit scanned', fullNote: '1 unit scanned (Cryoprecipitate — pooled cryo)' },
    { time: '00:37', note: '3 units scanned', fullNote: '3 units scanned (Platelets + Cryoprecipitate): 2 platelet + 1 pooled cryo' }
];

// MTP Event data for Operation Room
const operationRoomMTPEvents = [
    // RBC (PRBC)
    { time: '22:30', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '22:33', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '22:36', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '22:39', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '22:57', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '23:00', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '23:03', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    { time: '23:06', note: 'RBC', fullNote: 'RBC (PRBC) administered', type: 'RBC' },
    // FFP
    { time: '22:43', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '22:45', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '22:48', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '22:51', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '23:09', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '23:12', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    { time: '23:15', note: 'FFP', fullNote: 'Fresh Frozen Plasma administered', type: 'FFP' },
    // Platelets
    { time: '22:51', note: 'Platelets', fullNote: 'Platelets administered', type: 'Platelets' },
    { time: '22:58', note: 'Platelets', fullNote: 'Platelets administered', type: 'Platelets' },
    { time: '23:10', note: 'Platelets', fullNote: 'Platelets administered', type: 'Platelets' },
    // Cryo
    { time: '22:53', note: 'Cryo', fullNote: 'Cryoprecipitate administered', type: 'Cryo' },
    { time: '22:56', note: 'Cryo', fullNote: 'Cryoprecipitate administered', type: 'Cryo' }
];

// Vasopressors data for Operation Room
const operationRoomVasopressors = [
    { time: '22:15', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' },
    { time: '22:20', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' },
    { time: '22:27', drug: 'Ephedrine', note: 'Ephedrine', fullNote: 'Ephedrine administered' },
    { time: '22:32', drug: 'Vasopressin', note: 'Vasopressin', fullNote: 'Vasopressin administered' },
    { time: '22:36', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' },
    { time: '22:39', drug: 'Vasopressin', note: 'Vasopressin', fullNote: 'Vasopressin administered' },
    { time: '22:45', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' },
    { time: '22:47', drug: 'Ephedrine', note: 'Ephedrine', fullNote: 'Ephedrine administered' },
    { time: '22:59', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' },
    { time: '23:06', drug: 'Phenylephrine', note: 'Phenylephrine', fullNote: 'Phenylephrine administered' }
];

// Interventions data for Operation Room
const operationRoomInterventions = [
    { time: '23:33', note: 'Calcium chloride', fullNote: 'Calcium chloride administered' }
];

// Create medical action flags for Operation Room
function createOperationRoomMedicalActionFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -10;
    let actionIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomMedicalActions.forEach((action) => {
        if (action.timeRange) {
            // Handle time range actions (like D&C 22:25-22:40)
            const startMinutes = timeToMinutes(action.startTime);
            const endMinutes = timeToMinutes(action.endTime);
            
            if (startMinutes <= toMinutes && endMinutes >= fromMinutes) {
                const yPos = yOffset - (actionIndex * 0.1) -2; // Tiny offset to separate lines
                
                // Create start point
                flags.push({
                    x: startMinutes,
                    y: yPos,
                    doctor: action.doctor,
                    fullAction: `${action.doctor} (${action.action})`,
                    time: action.startTime,
                    isRangeStart: true,
                    rangeEnd: endMinutes
                });
                
                // Create end point
                flags.push({
                    x: endMinutes,
                    y: yPos,
                    doctor: action.doctor,
                    fullAction: `${action.doctor} (${action.action})`,
                    time: action.endTime,
                    isRangeEnd: true,
                    rangeStart: startMinutes
                });
                
                // No intermediate line points needed - Chart.js will connect the two points automatically
                
                actionIndex++;
            }
        } else {
            // Handle single time actions
            const actionMinutes = timeToMinutes(action.time);
            if (actionMinutes >= fromMinutes && actionMinutes <= toMinutes) {
                flags.push({
                    x: actionMinutes,
                    y: yOffset - (actionIndex * 0.1), // Tiny offset to separate lines
                    doctor: action.doctor,
                    fullAction: `${action.doctor} (${action.action})`,
                    time: action.time
                });
                actionIndex++;
            }
        }
    });
    
    return flags;
}

// Create notes flags for Operation Room
function createOperationRoomNotesFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -95;
    let noteIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomNotes.forEach((note) => {
        const noteMinutes = timeToMinutes(note.time);
        if (noteMinutes >= fromMinutes && noteMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(note.time),
                y: yOffset - (noteIndex % 2),
                note: note.note,
                comment: note.comment,
                // link removed
                linkType: note.linkType,
                fullNote: `${note.note}${note.comment ? ': ' + note.comment : ''}`,
                time: note.time
            });
            noteIndex++;
        }
    });
    
    return flags;
}

// Create orders flags for Operation Room
function createOperationRoomOrdersFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -80;
    let orderIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomOrders.forEach((order) => {
        const orderMinutes = timeToMinutes(order.time);
        if (orderMinutes >= fromMinutes && orderMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(order.time),
                y: yOffset - (orderIndex % 2) * 12,
                note: order.note,
                comment: order.comment,
                // link removed
                linkType: order.linkType,
                fullNote: `${order.note}${order.comment ? ': ' + order.comment : ''}`,
                time: order.time
            });
            orderIndex++;
        }
    });
    
    return flags;
}

// Create transfusion flags for Operation Room
function createOperationRoomTransfusionFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -25;
    let transfusionIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomTransfusion.forEach((transfusion) => {
        const transfusionMinutes = timeToMinutes(transfusion.time);
        if (transfusionMinutes >= fromMinutes && transfusionMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(transfusion.time),
                y: yOffset - (transfusionIndex % 2),
                note: transfusion.note,
                comment: transfusion.comment,
                // link removed
                fullNote: transfusion.fullNote || `${transfusion.note}${transfusion.comment ? ': ' + transfusion.comment : ''}`,
                time: transfusion.time
            });
            transfusionIndex++;
        }
    });
    
    return flags;
}

// Create vasopressors flags for Operation Room
function createOperationRoomVasopressorsFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -40;
    let vasopressorIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomVasopressors.forEach((vasopressor) => {
        const vasopressorMinutes = timeToMinutes(vasopressor.time);
        if (vasopressorMinutes >= fromMinutes && vasopressorMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(vasopressor.time),
                y: yOffset - (vasopressorIndex % 4) * 14,
                drug: vasopressor.drug,
                note: vasopressor.note,
                fullNote: vasopressor.fullNote,
                time: vasopressor.time
            });
            vasopressorIndex++;
        }
    });
    
    return flags;
}

// Create interventions flags for Operation Room
function createOperationRoomInterventionsFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -50;
    let interventionIndex = 0;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    operationRoomInterventions.forEach((intervention) => {
        const interventionMinutes = timeToMinutes(intervention.time);
        if (interventionMinutes >= fromMinutes && interventionMinutes <= toMinutes) {
            flags.push({
                x: timeToMinutes(intervention.time),
                y: yOffset - (interventionIndex % 2) * 10,
                note: intervention.note,
                comment: intervention.comment,
                // link removed
                fullNote: intervention.fullNote || `${intervention.note}${intervention.comment ? ': ' + intervention.comment : ''}`,
                time: intervention.time
            });
            interventionIndex++;
        }
    });
    
    return flags;
}

// Create Dr. Smith MTP flags for Operation Room
function createOperationRoomMTPEventFlags(timeFrom, timeTo, timeLabels, selectedVital = 'hr') {
    const flags = [];
    let yOffset = -110;
    
    const fromMinutes = timeToMinutes(timeFrom);
    const toMinutes = timeToMinutes(timeTo);
    
    // Collect all valid items first
    const validItems = operationRoomMTPEvents.filter(mtp => {
        const mtpMinutes = timeToMinutes(mtp.time);
        return mtpMinutes >= fromMinutes && mtpMinutes <= toMinutes;
    });
    
    // Create a more compact layout using time-based positioning
    const usedPositions = new Map();
    
    validItems.forEach((mtp, index) => {
        const mtpMinutes = timeToMinutes(mtp.time);
        
        // Find the best Y position for this time slot
        let bestY = yOffset;
        let level = 0;
        
        // Check for conflicts within ±2 minutes
        while (level < 4) { // Maximum 4 levels to stay within -150 limit
            const testY = yOffset - (level * 10);
            if (testY < -150) break; // Don't go below -150
            
            let hasConflict = false;
            for (let checkTime = mtpMinutes - 2; checkTime <= mtpMinutes + 2; checkTime++) {
                const posKey = `${checkTime}-${testY}`;
                if (usedPositions.has(posKey)) {
                    hasConflict = true;
                    break;
                }
            }
            
            if (!hasConflict) {
                bestY = testY;
                break;
            }
            level++;
        }
        
        // If still conflicts, use horizontal offset
        let finalX = mtpMinutes;
        let horizontalOffset = 0;
        while (usedPositions.has(`${finalX}-${bestY}`) && horizontalOffset < 5) {
            horizontalOffset++;
            finalX = mtpMinutes + (horizontalOffset % 2 === 0 ? horizontalOffset : -horizontalOffset);
        }
        
        // Mark position as used
        usedPositions.set(`${finalX}-${bestY}`, true);
        
        flags.push({
            x: finalX,
            y: bestY,
            note: mtp.note,
            type: mtp.type,
            fullNote: mtp.fullNote,
            time: mtp.time
        });
    });
    
    return flags;
}