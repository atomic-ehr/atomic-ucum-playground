import { parse, convert } from "@atomic-ehr/ucum";

const parsed = parse("10 mg");
console.log(parsed);

const converted = convert(parsed, "kg");
console.log(converted);