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