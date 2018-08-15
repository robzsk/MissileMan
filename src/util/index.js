const binChar = ')!@#$%^&';
const bin = binChar.split('');
const rix = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/';

const pad = s => s.length === 1 ? `00${s}` : s.length === 2 ? `0${s}` : s;

const fromNumber = number => {
  let r;
  let rem = Math.floor(number);
  let ret = '';
  while (true) {
    r = rem % 64;
    ret = `${rix.charAt(r)}${ret}`;
    rem = Math.floor(rem / 64);
    if (rem === 0) break;
  }
  return ret;
};

const toNumber = str =>
  str.split('').reduce((a, c) => (a * 64) + rix.indexOf(c), 0);

const compressReplay = replay =>
  Object.keys(replay).reduce((a, c) => {
    const i = replay[c];
    const r = fromNumber(Number(c));
    const n = bin[parseInt(`${Number(i.left)}${Number(i.right)}${Number(i.morph)}`, 2)];
    return `${a}${r}${n}`;
  }, '');

const decompressReplay = str => {
  const m = str.split(new RegExp(`[\\${binChar.split('').join('\\')}]`, 'gi'));
  m.pop();
  const n = str.split(new RegExp(`[${rix}]+`, 'gi'));
  n.shift();

  return m.reduce((a, c, i) => {
    const r = toNumber(c)
    const [left, right, morph] = pad(binChar.indexOf(n[i]).toString(2)).split('').map(d => !!Number(d));
    a[`${r}`] = { left, right, morph };
    return a;
  }, {});
};

module.exports = {
  compressReplay,
  decompressReplay,
};
