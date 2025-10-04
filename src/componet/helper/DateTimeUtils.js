// ---------------- Date ---------------- 
// CreatedDate
export const CreatedDate = (createddate) => {
    const date = new Date(createddate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
}

// Add   // (2025-02-01 -> 01 feb 2025)
export const FormattedDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return formattedDate;
}

// Edit   // (01 feb 2025 -> 2025-02-01)
export const ConvertDateFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};


// ---------------- Time ---------------- 

// Add   // (19:27 -> 7:27 pm)
export const FormatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

// Edit  // (7:27 pm -> 19:27)
export const convertTo24HourFormat = (time) => {
    let [hours, minutesPart] = time?.split(':');
    let minutes = minutesPart?.slice(0, 2);
    let period = minutesPart?.slice(-2).toUpperCase();

    hours = parseInt(hours, 10);

    if (period === "AM" && hours === 12) {
        hours = 0; // 12 AM becomes 00
    }
    if (period === "PM" && hours !== 12) {
        hours += 12; // Convert PM times except 12 PM
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};