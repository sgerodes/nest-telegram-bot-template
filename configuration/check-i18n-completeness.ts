import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads all full translation keys for a given language.
 * @param langPath The path to the language folder.
 * @returns A Set containing all full keys found in the language files.
 */
export function getAllKeysForLanguage(langPath: string): Set<string> {
    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));
    const allKeys = new Set<string>();

    files.forEach(file => {
        const filePath = path.join(langPath, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        collectFullKeys(content, '', allKeys);
    });

    return allKeys;
}

/**
 * Validates if all translation files contain the same full keys across languages.
 * @param translationsPath The path to the translations folder.
 * @returns An object listing missing full keys for each language.
 */
export function validateTranslations(translationsPath: string): Record<string, string[]> {
    const languageDirs = fs.readdirSync(translationsPath).filter(dir => fs.lstatSync(path.join(translationsPath, dir)).isDirectory());
    const allFullKeys = new Set<string>();
    const translations: Record<string, Record<string, any>> = {};

    // Collect all full keys from all languages
    languageDirs.forEach(lang => {
        const langPath = path.join(translationsPath, lang);
        translations[lang] = {};
        const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));

        files.forEach(file => {
            const filePath = path.join(langPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            translations[lang][file] = content;
            collectFullKeys(content, '', allFullKeys);
        });
    });

    // Check for missing full keys in each language and file
    const missingKeysPerLang: Record<string, string[]> = {};

    Object.entries(translations).forEach(([lang, files]) => {
        missingKeysPerLang[lang] = [];

        Object.entries(files).forEach(([file, content]) => {
            const missingKeys = [...allFullKeys].filter(key => !getNestedKey(content, key));
            if (missingKeys.length) {
                missingKeysPerLang[lang].push(`${file.replace('.json', '')}.${missingKeys.join(', ')}`);
            }
        });
    });

    return missingKeysPerLang;
}

/**
 * Recursively collects only full keys (leaf nodes) from an object.
 * @param obj The translation object.
 * @param prefix The current key prefix.
 * @param keySet The Set to store full keys.
 */
function collectFullKeys(obj: any, prefix: string, keySet: Set<string>) {
    Object.keys(obj).forEach(key => {
        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            collectFullKeys(obj[key], fullPath, keySet);
        } else {
            keySet.add(fullPath); // Only add if it's a final value
        }
    });
}

/**
 * Retrieves a nested key from an object.
 * @param obj The object to search.
 * @param path The dot-separated key path.
 * @returns The value if found, otherwise undefined.
 */
function getNestedKey(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}


const missingKeys = validateTranslations('./i18n');
console.log(missingKeys);