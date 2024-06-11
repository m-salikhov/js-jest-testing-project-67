export function getExtension(str) {
  const extension = str.match(/\.(png|jpeg|jpg|gif|css|js|xml|ico|svg|rss|woff2)/);

  return extension ? extension[0] : null;
}

export function makeName(str) {
  if (str.at(-1) === `/`) {
    str = str.slice(0, str.length - 1);
  }

  const decodeStr = decodeURI(str);

  let withoutProtocol = decodeStr.replace(/(http|https):\/\//, '');

  const extension = getExtension(withoutProtocol);

  if (withoutProtocol.endsWith(extension)) {
    withoutProtocol = withoutProtocol.slice(0, withoutProtocol.length - extension.length);
  }

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');

  return extension ? fileName + extension : fileName;
}

export function makeURL(str, url) {
  if (!str) {
    return '';
  } else if (str.startsWith('//')) {
    return url.protocol + str;
  } else if (str.startsWith('/')) {
    return url.origin + str;
  } else return str;
}

export default { makeName, makeURL, getExtension };
