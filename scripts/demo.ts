import ucum from "@atomic-ehr/ucum";

// Validate a unit
const validation = ucum.validate("mg");
console.log("Validation:", validation);

// Create a quantity
const quantity = ucum.quantity(10, "mg");
console.log("Quantity:", quantity);

// Convert between units
const converted = ucum.convert(10, "mg", "g");
console.log("Converted:", converted, "g");

// Get unit information
const unitInfo = ucum.info("mg");
console.log("Unit info:", unitInfo);

// Display unit name
const display = ucum.display("mg");
console.log("Display name:", display);