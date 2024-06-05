const statePatterns = {
    "AL": { pattern: /^\d{7,8}$/, placeholder: "7 or 8 digits" }, // Alabama
    "AK": { pattern: /^\d{7}$/, placeholder: "7 digits" }, // Alaska
    "AZ": { pattern: /^[A-Za-z]{1}\d{8}$/, placeholder: "1 Alpha + 8 digits" }, // Arizona
    "AR": { pattern: /^(\d{9}|^\d{3}-\d{2}-\d{4}$)$/, placeholder: "9 digits or SSN" }, // Arkansas
    "CA": { pattern: /^[A-Za-z]{1}\d{7}$/, placeholder: "1 Alpha + 7 digits" }, // California
    "CO": { pattern: /^\d{9}$/, placeholder: "9 digits" }, // Colorado
    "CT": { pattern: /^\d{9}$/, placeholder: "9 digits" }, // Connecticut
    "DE": { pattern: /^\d{1,7}$/, placeholder: "1-7 digits" }, // Delaware
    "DC": { pattern: /^\d{7}$/, placeholder: "7 digits" }, // District of Columbia
    "FL": { pattern: /^[A-Za-z]{1}\d{12}$/, placeholder: "1 Alpha + 12 digits" }, // Florida
    "GA": { pattern: /^(\d{9}|^\d{3}-\d{2}-\d{4}$)$/, placeholder: "9 digits or SSN" }, // Georgia
    "HI": { pattern: /^H\d{8}$/, placeholder: "H + 8 digits" }, // Hawaii
    "ID": { pattern: /^[A-Za-z]{3}\d{6}$/, placeholder: "3 Alpha + 6 digits" }, // Idaho
    "IL": { pattern: /^[A-Za-z]{1}\d{11}$/, placeholder: "1 Alpha + 11 digits" }, // Illinois
    "IN": { pattern: /^\d{10}$/, placeholder: "10 digits" }, // Indiana
    "IA": { pattern: /^\d{3}[A-Za-z]{2}\d{4}$/, placeholder: "3 digits + 2 Alpha + 4 digits" }, // Iowa
    "KS": { pattern: /^K\d{8}$/, placeholder: "K + 8 digits" }, // Kansas
    "KY": { pattern: /^[A-Za-z]{1}\d{8}$/, placeholder: "1 Alpha + 8 digits" }, // Kentucky
    "LA": { pattern: /^0\d{8}$/, placeholder: "0 + 8 digits" }, // Louisiana
    "ME": { pattern: /^\d{7}$/, placeholder: "7 digits" }, // Maine
    "MD": { pattern: /^[A-Za-z]{1}\d{12}$/, placeholder: "1 Alpha + 12 digits" }, // Maryland
    "MA": { pattern: /^(S\d{8}|SA\d{7})$/, placeholder: "S + 8 digits or SA + 7 digits" }, // Massachusetts
    "MI": { pattern: /^[A-Za-z]{1}\d{12}$/, placeholder: "1 Alpha + 12 digits" }, // Michigan
    "MN": { pattern: /^[A-Za-z]{1}\d{12}$/, placeholder: "1 Alpha + 12 digits" }, // Minnesota
    "MS": { pattern: /^\d{9}$/, placeholder: "9 digits" }, // Mississippi
    "MO": { pattern: /^[A-Za-z]{1}\d{9}$/, placeholder: "1 Alpha + 9 digits" }, // Missouri
    "MT": { pattern: /^\d{13}$/, placeholder: "13 digits" }, // Montana
    "NE": { pattern: /^[A-Za-z]{1}\d{8}$/, placeholder: "1 Alpha + 8 digits" }, // Nebraska
    "NV": { pattern: /^\d{12}$/, placeholder: "12 digits" }, // Nevada
    "NH": { pattern: /^(?:[A-Za-z]{3}\d{8}|\d{2}[A-Za-z]{3}\d{5})$/, placeholder: "3 Alpha + 8 digits or 2 digits + 3 Alpha + 5 digits" }, // New Hampshire
    "NJ": { pattern: /^[A-Za-z]{1}\d{14}$/, placeholder: "1 Alpha + 14 digits" }, // New Jersey
    "NM": { pattern: /^\d{9}$/, placeholder: "9 digits" }, // New Mexico
    "NY": { pattern: /^\d{9}$/, placeholder: "9 digits" }, // New York
    "NC": { pattern: /^\d{12}$/, placeholder: "12 digits" }, // North Carolina
    "ND": { pattern: /^[A-Za-z]{3}\d{6}$/, placeholder: "3 Alpha + 6 digits" }, // North Dakota
    "OH": { pattern: /^[A-Za-z]{2}\d{6}$/, placeholder: "2 Alpha + 6 digits" }, // Ohio
    "OK": { pattern: /^[A-Za-z]{1}\d{9}$/, placeholder: "1 Alpha + 9 digits" }, // Oklahoma
    "OR": { pattern: /^[A-Za-z]{1}\d{6,7}$/, placeholder: "1 Alpha + 6 or 7 digits" }, // Oregon
    "PA": { pattern: /^\d{8}$/, placeholder: "8 digits" }, // Pennsylvania
    "RI": { pattern: /^(\d{7}|V\d{6})$/, placeholder: "7 digits or V + 6 digits" }, // Rhode Island
    "SC": { pattern: /^\d{6,11}$/, placeholder: "6-11 digits" }, // South Carolina
    "SD": { pattern: /^(\d{8}|^\d{3}-\d{2}-\d{4}$)$/, placeholder: "8 digits or SSN" }, // South Dakota
    "TN": { pattern: /^(\d{9}|\d{7,8})$/, placeholder: "9 digits or 7-8 digits (old)" }, // Tennessee
    "TX": { pattern: /^\d{8}$/, placeholder: "8 digits" }, // Texas
    "UT": { pattern: /^\d{4,10}$/, placeholder: "4-10 digits" }, // Utah
    "VT": { pattern: /^(\d{8}|\d{7}[A-Za-z]{1})$/, placeholder: "8 digits or 7 digits + A" }, // Vermont
    "VA": { pattern: /^[A-Za-z]{1}\d{8}$/, placeholder: "1 Alpha + 8 digits" }, // Virginia
    "WA": { pattern: /^(([A-Za-z]{5}\d{3}([A-Za-z]{2}|\d{2}))|(WDL[A-Za-z\d]{9}[A-Za-z]{2}))$/, placeholder: "5 Alpha + 3 digits + (2 Alpha or 2 digits) or WDL + 9 Letters or Numbers + 2 Letters/Numbers" }, // Washington
    "WV": { pattern: /^\d{7}[A-Za-z]{1,2}\d{5,6}$/, placeholder: "7 digits + 1-2 Alpha + 5-6 digits" }, // West Virginia
    "WI": { pattern: /^[A-Za-z]{1}\d{13}$/, placeholder: "1 Alpha + 13 digits" }, // Wisconsin
    "WY": { pattern: /^\d{9}$/, placeholder: "9 digits" } // Wyoming
};

    const stateInput = document.getElementById('licenseState');
    const licenseInput = document.getElementById('licenseNumber');
    const form = document.getElementById('testDriveForm');
    
    function updatePlaceholder() {
        const selectedState = stateInput.value.toUpperCase();
        const stateInfo = statePatterns[selectedState];
    
        if (stateInfo) {
            licenseInput.placeholder = stateInfo.placeholder;
        } else {
            licenseInput.placeholder = "Enter license number";
        }
    }
    function validateLicense() {
        const selectedState = stateInput.value.toUpperCase();
        const licenseNumber = licenseInput.value;
        const stateInfo = statePatterns[selectedState];
    
        if (stateInfo && !stateInfo.pattern.test(licenseNumber)) {
            licenseInput.setCustomValidity('Invalid license number for the selected state.');
        } else {
            licenseInput.setCustomValidity('');
        }
    }
    
    stateInput.addEventListener('input', () => {
        updatePlaceholder();
        validateLicense();
    });
    licenseInput.addEventListener('input', validateLicense);
    
    form.addEventListener('submit', function(event) {
        validateLicense();
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
    });