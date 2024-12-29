import * as fs from 'fs';

export async function readFile(filePath: string): Promise<Buffer | null> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return await fs.promises.readFile(filePath);
  } catch (err) {
    return null;
  }
}
