function DDMMYYtoISO(dateString) {
    try {
        const parts = dateString.split(".");
        const date = new Date(0); // Нас интересует только день

        date.setDate(parts[0]);
        date.setMonth(parts[1]-1);
        date.setFullYear(2000 + +parts[2]);

        return date.toISOString();
    }
    catch {
        return null;
    }
}

function ISOtoDDMMYY(dateString) {
    try {
        const date = new Date(dateString).toISOString().replace(/T.*/,'').split('-').reverse().join('.')
        return date;
    }
    catch {
        return dateString;
    }
}

function checkIfOutdated(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    return date < now;
}
