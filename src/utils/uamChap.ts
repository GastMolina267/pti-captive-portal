import CryptoJS from 'crypto-js';

/**
 * Devuelve la respuesta CHAP en hex (MD5)
 * @param password Contraseña en texto claro ingresada por el usuario
 * @param challengeHex
 */
export function chapResponse(password: string, challengeHex: string): string {
  const idByte = String.fromCodePoint(0x00);

  const idWord = CryptoJS.enc.Latin1.parse(idByte);
  const passWord = CryptoJS.enc.Latin1.parse(password);
  const challengeWord = CryptoJS.enc.Hex.parse(challengeHex);

  const message = idWord.concat(passWord).concat(challengeWord);
  return CryptoJS.MD5(message).toString(CryptoJS.enc.Hex);
}

export function buildUamLogonUrl(
  uamip: string,
  uamport: string,
  username: string,
  password: string,
  challengeHex?: string,
  redirectUrl?: string,
): string {
  const hasChallenge = Boolean(challengeHex && challengeHex.length > 0);
  const responseHex = hasChallenge ? chapResponse(password, challengeHex!) : '';
  const base = `http://${uamip}:${uamport}/logon`;
  const qs = new URLSearchParams({
    username: username,
    password: password,
  });
  if (hasChallenge) {
    qs.set('response', responseHex);
    qs.set('md', responseHex);
    qs.set('challenge', challengeHex!);
  }
  if (redirectUrl) {
    qs.set('userurl', redirectUrl);
    qs.set('redirurl', redirectUrl);
  }
  return `${base}?${qs.toString()}`;
}
