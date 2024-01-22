export function checkExtension(string) {
  return /\.(png|jpeg|jpg|gif|css|js|xml|ico)$/.test(string);
}

function makeFileName(str) {
  if (!str) {
    return undefined;
  }

  const withoutProtocol = str.replace(/(http|https):\/\//, '');

  if (checkExtension(withoutProtocol)) {
    const indexExtension = withoutProtocol.lastIndexOf('.');
    const extension = withoutProtocol.slice(indexExtension);

    const fileNameWithoutExtension = withoutProtocol.slice(0, indexExtension);
    const fileName = fileNameWithoutExtension.replace(/[^\p{L}\d]/gu, '-');

    return fileName + extension;
  }

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');
  return fileName;
}

export default makeFileName;
