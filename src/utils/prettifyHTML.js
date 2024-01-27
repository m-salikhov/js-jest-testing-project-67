import fs from 'fs/promises';
import prettier from 'prettier';

const { format: beautify } = prettier;

const options = {
  parser: 'html',
  tabWidth: 2,
  singleAttributePerLine: false,
  printWidth: 180,
};

const prettifyHTMl = async (filepath) => {
  const data = await fs.readFile(filepath, 'utf-8');
  await fs.writeFile(filepath, await beautify(data, options));
};

export default prettifyHTMl;
