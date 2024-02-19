export function decodeFromHex(hexUrl: string) {
  const buffer = Buffer.from(hexUrl, "hex");
  return buffer.toString("utf-8");
}
export function encodeToHex(url: string) {
  const buffer = Buffer.from(url, "utf-8");
  const hexUrl = buffer.toString("hex");

  return hexUrl;
}
