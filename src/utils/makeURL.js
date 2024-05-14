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
