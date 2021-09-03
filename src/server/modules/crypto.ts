import crypto from "crypto";

const algorithm = "AES-256-GCM";
const secretKey = Buffer.alloc(32).fill(process.pid.toString());

export const encrypt = (message: string) => {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(64);
  const key = crypto.pbkdf2Sync(secretKey, salt, 2145, 32, "sha512");
  const cipher = crypto.createCipheriv(algorithm, key, iv) as crypto.CipherGCM;
  const encrypted = Buffer.concat([
    cipher.update(message, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
};

export const decrypt = (message: string) => {
  const bData = Buffer.from(message, "base64");
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96).toString("binary");
  const key = crypto.pbkdf2Sync(secretKey, salt, 2145, 32, "sha512");
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    iv
  ) as crypto.DecipherGCM;
  decipher.setAuthTag(tag);
  return decipher.update(text, "binary", "utf8") + decipher.final("utf8");
};
