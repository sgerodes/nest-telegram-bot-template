const fs = require("fs");

const i18nFilePath = "./configuration/i18n/en/i18n.json";
const outputFilePath = "./configuration/i18n/i18nKeys.ts";

function generateKeys(obj, path = []) {
    return Object.keys(obj).reduce((acc, key) => {
        const fullPath = [...path, key].join(".");
        if (typeof obj[key] === "object" && obj[key] !== null) {
            acc[key] = generateKeys(obj[key], [...path, key]);
        } else {
            acc[key] = fullPath; // Store the string key path
        }
        return acc;
    }, {});
}

const i18nJson = JSON.parse(fs.readFileSync(i18nFilePath, "utf8"));
const keysObject = generateKeys(i18nJson);

const content = `export const I18N_KEYS = ${JSON.stringify(keysObject, null, 2)} as const;`;
fs.writeFileSync(outputFilePath, content);

console.log("✅ i18nKeys.ts has been generated successfully!");