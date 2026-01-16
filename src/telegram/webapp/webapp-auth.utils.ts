import { createHash, createHmac } from 'crypto';

type ParsedInitData = {
  authDate?: number;
  hash?: string;
  user?: Record<string, unknown>;
  [key: string]: unknown;
};

const parseInitData = (initData: string): ParsedInitData => {
  const params = new URLSearchParams(initData);
  const data: ParsedInitData = {};
  params.forEach((value, key) => {
    if (key === 'auth_date') {
      data.authDate = Number(value);
      return;
    }
    if (key === 'user') {
      try {
        data.user = JSON.parse(value);
      } catch {
        data.user = undefined;
      }
      return;
    }
    if (key === 'hash') {
      data.hash = value;
      return;
    }
    data[key] = value;
  });
  return data;
};

const buildDataCheckString = (initData: string): string => {
  const params = new URLSearchParams(initData);
  const pairs: string[] = [];
  params.forEach((value, key) => {
    if (key === 'hash') {
      return;
    }
    pairs.push(`${key}=${value}`);
  });
  return pairs.sort().join('\n');
};

export const validateInitData = (
  initData: string,
  botToken: string,
  maxAgeSeconds: number = 60 * 60 * 24,
): ParsedInitData => {
  const parsed = parseInitData(initData);
  if (!parsed.hash || !parsed.authDate) {
    throw new Error('initData is missing hash or auth_date.');
  }

  const dataCheckString = buildDataCheckString(initData);
  const secretKey = createHash('sha256').update(botToken).digest();
  const computed = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computed !== parsed.hash) {
    throw new Error('initData signature is invalid.');
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - parsed.authDate > maxAgeSeconds) {
    throw new Error('initData is too old.');
  }

  return parsed;
};
