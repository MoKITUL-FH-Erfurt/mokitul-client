import sha256 from 'crypto-js/sha256';

function hashValue(value: string | undefined): string | null {
  if (!value) return null;

  return sha256(value).toString();
}

export { hashValue };
