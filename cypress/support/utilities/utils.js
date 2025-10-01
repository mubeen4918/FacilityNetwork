// Function to generate a random numeric value within a specified range
export function generateNumericValue(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export function generateUSPhoneNumber() {
  // Area codes in US can't start with 0 or 1
  const getDigit = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const areaCode = `${getDigit(2, 9)}${getDigit(0, 9)}${getDigit(0, 9)}`;
  const centralOfficeCode = `${getDigit(2, 9)}${getDigit(0, 9)}${getDigit(0, 9)}`;
  const lineNumber = `${getDigit(0, 9)}${getDigit(0, 9)}${getDigit(0, 9)}${getDigit(0, 9)}`;
  return `${areaCode}${centralOfficeCode}${lineNumber}`;
}

export function generateRandomCompanyName() {
    const companies = [
        "TechNova", "BluePeak", "GreenLeaf", "SkyBridge", "DataCore", "PrimeWave",
        "NextGen", "CloudSync", "BrightPath", "FusionWorks", "ApexLogic", "UrbanEdge"
    ];
    const randomIndex = Math.floor(Math.random() * companies.length);
    const now = new Date();
    const datestamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    return `${companies[randomIndex]}_${datestamp}`;
}

// Function to generate a random email address
export function generateRandomEmail() {
const names = [
    "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery",
    "Cameron", "Drew", "Quinn", "Skyler", "Reese", "Peyton", "Blake", "Hayden"
];
const randomName = names[Math.floor(Math.random() * names.length)];
const timestamp = Date.now();
const randomStr = Math.random().toString(36).substring(2, 6);
return `${randomName.toLowerCase()}${randomStr}${timestamp}@example.com`;
}
export function getMessageNotification(expectedText) {
    return cy.get('.swal2-html-container')
        .invoke('text')
        .then((text) => {
            expect(text.toLowerCase()).to.include(expectedText.toLowerCase());
        });
}


export function  closeMessageNotification(button) {
    cy.get('div.swal2-actions > button.swal2-confirm.swal2-styled')
        .contains(button)
        .click();
}



export function selectFromDropdown(dropdownElement) {
    cy.wait(1000);
    dropdownElement.should('be.visible').click();
    cy.get('.ng-option').then(options => {
        const randomIndex = Math.floor(Math.random() * options.length);
        cy.wrap(options[randomIndex]).click({ force: true });
    });
}

