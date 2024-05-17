export function getExtension(str) {
  const extension = str.match(/\.(png|jpeg|jpg|gif|css|js|xml|ico|svg|rss|woff2)/);

  return extension ? extension[0] : null;
}

function makeFileName(str) {
  if (str.at(-1) === `/`) {
    str = str.slice(0, str.length - 1);
  }

  const withoutProtocol = str.replace(/(http|https):\/\//, '');

  const extension = getExtension(withoutProtocol);

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');

  return extension ? fileName + extension : fileName;
}

export default makeFileName;
