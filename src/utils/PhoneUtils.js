// import parsePhoneNumberFromString, { getCountryCallingCode } from "libphonenumber-js";
import { getCountryCallingCode } from 'libphonenumber-js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Remove all spaces/hyphens, keep only digits and +
export const normalizeNumber = (num) => {
    if (!num) return "";
    return num.replace(/[\s-]/g, "");
};

// Parse backend stringified phone JSON → usable object
export const parseBackendPhone = (mobileNumber) => {
    if (!mobileNumber) {
        return { country_code: "", phone_number: "" };
    }

    try {
        const parsed = JSON.parse(mobileNumber);
        return {
            country_code: parsed.country_code?.toLowerCase() || "",
            phone_number: parsed.phone_number || "",
        };
    } catch (err) {
        return { country_code: "", phone_number: "" };
    }
};

// Prepare phone for backend (UI → backend string)
export const formatForBackend = (phoneObj) => {
    if (!phoneObj) return "";
    return JSON.stringify({
        country_code: phoneObj.country_code?.toLowerCase() || "",
        phone_number: normalizeNumber(phoneObj.phone_number) || "",
    });
};

export const formatDisplayNumber = (phone_number, country_code) => {
    if (!phone_number) return '';

    const iso2 = country_code.toUpperCase();

    let fullNumber = phone_number;

    if (!fullNumber.startsWith('+')) {
        try {
            const dialCode = getCountryCallingCode(iso2);
            fullNumber = `+${dialCode}${normalizeNumber(fullNumber)}`;
        } catch (err) {
            return phone_number;
        }
    }

    let displayNumber = fullNumber;

    try {
        const phoneNumber = parsePhoneNumberFromString(fullNumber, iso2);

        if (phoneNumber && phoneNumber.isValid()) {
            const national = phoneNumber.formatInternational();
            displayNumber = `${national}`;
        }
    } catch (err) {
        console.error("Failed to format phone number", err);
    }

    return displayNumber;
};