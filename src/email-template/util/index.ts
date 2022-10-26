import { promisify } from 'bluebird';
import { readFile } from 'fs';

const readFileAsync = promisify(readFile);

export const readFileToStringAsync = async (filename: string) => {
  const buffer = await readFileAsync(filename);
  return buffer.toString();
};
