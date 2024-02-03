export function checkExtension(string) {
  return /\.(png|jpeg|jpg|gif|css|js|xml|ico|svg|rss)$/.test(string);
}

function makeFileName(str) {
  if (!str) {
    return undefined;
  }

  if (str.at(-1) === `/`) {
    str = str.slice(0, str.length - 1);
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
