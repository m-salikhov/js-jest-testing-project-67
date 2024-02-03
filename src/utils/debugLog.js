import debug from 'debug';

const debugIns = debug('page-loader');

export default function debugLogger(formater, text) {
  debugIns(formater, text);
}
