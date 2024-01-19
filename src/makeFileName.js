function makeFileName(str) {
  if (!str) {
    return undefined;
  }

  const withoutProtocol = str.replace(/(http|https):\/\//, '');

  if (/\.(png|jpeg|jpg|gif)$/.test(withoutProtocol)) {
    const indexExtesion = withoutProtocol.lastIndexOf('.');
    const extesion = withoutProtocol.slice(indexExtesion);

    const fileNameWithoutExtension = withoutProtocol.slice(0, indexExtesion);
    const fileName = fileNameWithoutExtension.replace(/[^\p{L}\d]/gu, '-');

    return fileName + extesion;
  }

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');
  return fileName;
}

export default makeFileName;
