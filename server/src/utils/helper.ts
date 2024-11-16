// Function to encode Uint8Array to base64
export function encodeUpdate(update: any) {
  return Buffer.from(update).toString("base64");
}

// Function to decode base64 to Uint8Array
export function decodeUpdate(update: any) {
  if (typeof update === "string") {
    return Uint8Array.from(Buffer.from(update, "base64"));
  } else {
    console.warn("Received non-string update for decoding:", update);
    throw new TypeError("Expected a base64-encoded string for update");
  }
}
