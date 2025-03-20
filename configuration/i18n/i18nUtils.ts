import * as path from 'path';
import * as fs from 'fs';


export function extractJsonKeys(jsonData: object): Set<string> {
    const keys = new Set<string>();

    function traverse(obj: any, prefix = '') {
    if (typeof obj === 'object' && obj !== null) {
      for (const key of Object.keys(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        // Only add the key if its value is NOT an object (i.e., it's a leaf key)
        if (typeof obj[key] !== 'object' || obj[key] === null) {
          keys.add(newKey);
        } else {
          traverse(obj[key], newKey);
        }
      }
    }
  }
  traverse(jsonData);
  return keys;
}

export function readJson(filePath: string): object | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing JSON file at ${filePath}: ${error.message}`);
    return null;
  }
}

export function listFilesInFolder(folderPath: string): string[] {
  try {
    return fs.readdirSync(folderPath)
      .filter(file => fs.statSync(path.join(folderPath, file)).isFile());
  } catch (error) {
    console.error(`Error reading folder ${folderPath}: ${error.message}`);
    return [];
  }
}

export function readLangKeys(i18nPath: string, languagesToCheck: string[]): object {
  const langKeys = {};

  for (const lang of languagesToCheck) {
    const langFolder = path.join(i18nPath, lang);
    const langFiles = listFilesInFolder(langFolder);
    let langKeysSet = new Set<string>();
    for (const f of langFiles) {
      const fullPath = path.join(i18nPath, lang, f);
      const jsonObject = readJson(fullPath);
      const keys = extractJsonKeys(jsonObject);
      langKeysSet = addSets(langKeysSet, prefixKeysWithFileName(f, keys));
    }
    langKeys[lang] = langKeysSet;
  }
  return langKeys;
}


export function combinedKeys(langKeys: object): Set<string> {
  let keys = new Set<string>();

  for (const lang in langKeys) {
    keys = addSets(keys, langKeys[lang]);
  }

  return keys;
}

function prefixKeysWithFileName(fileName: string, keys: Iterable<string>): Set<string> {
  fileName = path.basename(fileName);
  const prefix = fileName.replace('.json', '');
  const prefixedKeys = new Set<string>();
  for (const key of keys) {
  prefixedKeys.add(`${prefix}.${key}`);
}
return prefixedKeys;
}

function subtractSets(setA: Set<string>, setB: Set<string>): Set<string> {
  return new Set([...setA].filter(item => !setB.has(item)));
}

function addSets(setA: Set<string>, setB: Set<string>): Set<string> {
  return new Set([...setA, ...setB]);
}