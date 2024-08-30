import crypto from "crypto";
import zlib from "zlib";

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from("8f742b0c15d7786c8f1c23b73e45e7c911d3a5c1f9d5c59a1b5a8c5d29e672f5", "hex");
const iv = crypto.randomBytes(16); // Initialization vector

// Custom replacer function to handle BigInt as strings
function replacer(key: string, value: any): any {
  return typeof value === "bigint" ? value.toString() : value;
}

// Custom reviver function to convert strings back to BigInt
function reviver(key: string, value: any): any {
  return typeof value === "string" && /^\d+$/.test(value) ? BigInt(value) : value;
}

// Function to compress, encrypt, and encode an object for URL usage
export function compressEncryptAndEncode(obj: object): string {
  const jsonString = JSON.stringify(obj, replacer);

  // Compress the JSON string
  const compressed = zlib.deflateSync(jsonString);

  // Encrypt the compressed string
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(compressed);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Convert to Base64 and make it URL-safe
  const base64String = encrypted.toString("base64");
  const urlSafeString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  // Return the IV and the encrypted, URL-safe string
  return `${iv.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}:${urlSafeString}`;
}

// Function to decode, decrypt, and decompress the object from the URL-safe string
export function decodeDecryptAndDecompress(param: string): object | undefined {
  const encryptedString = param;
  const [ivString, encryptedData] = encryptedString.split("%3A");
  if (!ivString || !encryptedData) {
    throw new Error("Invalid encrypted string format.");
  }

  const ivBuffer = Buffer.from(ivString.replace(/-/g, "+").replace(/_/g, "/"), "base64");
  const encryptedBuffer = Buffer.from(encryptedData.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  // Decrypt the data
  const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Decompress the decrypted string
  const decompressed = zlib.inflateSync(decrypted).toString("utf8");

  return JSON.parse(decompressed, reviver);
}
