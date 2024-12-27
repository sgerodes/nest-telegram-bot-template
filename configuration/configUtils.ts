import * as path from 'path';
import * as fs from 'fs';

/**
 * Retrieves the root path of the project by looking for the nearest 'package.json' file
 * starting from the current directory and moving up the directory tree.
 *
 * @returns {string} The absolute path to the project's root directory.
 */
export function getProjectRootPath(): string {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..');
  }
  return currentDir;
}

/**
 * Converts a given project directory path into an absolute path based on the project's root directory.
 *
 * @param {string} projectDirectory - The relative path to the project directory.
 * @returns {string} The absolute path to the specified project directory.
 */
export function getAbsolutePathForProjectDirectory(
  projectDirectory: string,
): string {
  const pathSegments = projectDirectory.split('/').filter(segment => segment);
  return path.join(getProjectRootPath(), ...pathSegments) + path.sep;
}


/**
 * Splits a comma-separated string into a set of numbers.
 *
 * @param {string} stringList - A comma-separated string of numbers.
 * @returns {Set<number>} A set containing the unique numbers from the string.
 */
// export function splitStringIntoNumberSet(stringList: string): Set<number> {
//   return new Set(
//     stringList
//       .split(',')
//       .map(id => id.trim())
//       .filter(id => id !== '')
//       .map(Number)
//   )
// }

/**
 * Splits a comma-separated string into a set of either numbers or strings.
 *
 * @template T - The type of the elements in the set (number or string).
 * @param {string} stringList - A comma-separated string of numbers or strings.
 * @param {(value: string) => T} transform - A function to transform the string elements into the desired type.
 * @returns {Set<T>} A set containing the unique elements of the specified type.
 */
export function splitStringIntoSet<CollectionElementT> (
  stringList: string | null | undefined,
  transform: (value: string) => CollectionElementT
): Set<CollectionElementT> {
  if (!stringList) {
    return new Set<CollectionElementT>();
  }
  return new Set(
    stringList
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')
      .map(transform)
  );
}
