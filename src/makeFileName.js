function makeFileName(str) {
  const withoutProtocol = str.replace(/(http|https):\/\//, '');
  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');
  return fileName + '.html';
}

export default makeFileName;
