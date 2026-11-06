// VietQR local generator
function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function f(id, val) {
  const len = String(val.length).padStart(2, '0');
  return id + len + val;
}

export function generateVietQRPayload({ bankBin = '970407', accountNo, amount, memo }) {
  const sub00 = f('00', bankBin);
  const sub01 = f('01', accountNo);
  const tag38_01 = f('01', sub00 + sub01);
  const tag38_00 = f('00', 'A000000727');
  const tag38_02 = f('02', 'QRIBFTTA');
  const tag38 = f('38', tag38_00 + tag38_01 + tag38_02);
  
  let raw = f('00', '01') + f('01', amount ? '12' : '11') + tag38 + f('53', '704');
  if (amount) {
    raw += f('54', String(amount));
  }
  raw += f('58', 'VN');
  if (memo) {
    raw += f('62', f('08', memo));
  }
  raw += '6304';
  const checksum = crc16(raw);
  return raw + checksum;
}
