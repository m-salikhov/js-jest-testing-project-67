export function getExtension(str) {
  const extension = str.match(/\.(png|jpeg|jpg|gif|css|js|xml|ico|svg|rss|woff2)/);

  return extension ? extension[0] : null;
}

function makeFileName(str) {
  if (!str || !getExtension(str)) {
    return null;
  }

  const withoutProtocol = str.replace(/(http|https):\/\//, '');

  const extension = getExtension(withoutProtocol);

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');

  return fileName + extension;
}

export default makeFileName;
