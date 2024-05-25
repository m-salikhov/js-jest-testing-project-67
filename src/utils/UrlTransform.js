export function getExtension(str) {
  const extension = str.match(/\.(png|jpeg|jpg|gif|css|js|xml|ico|svg|rss|woff2)/);

  return extension ? extension[0] : null;
}

export function makeName(str) {
  if (str.at(-1) === `/`) {
    str = str.slice(0, str.length - 1);
  }

  //перенести в makeURL?
  const decodeStr = decodeURI(str);

  const withoutProtocol = decodeStr.replace(/(http|https):\/\//, '');

  const extension = getExtension(withoutProtocol);

  const fileName = withoutProtocol.replace(/[^\p{L}\d]/gu, '-');

  return extension ? fileName + extension : fileName;
}

//переделать под одиночную строку
export function makeURL(linksArr, url) {
  const arr = linksArr.map((v) => {
    if (!v) {
      return '';
    } else if (v.startsWith('//')) {
      return url.protocol + v;
    } else if (v.startsWith('/')) {
      return url.origin + v;
    } else return v;
  });

  return arr;
}

export default { makeName, makeURL, getExtension };
