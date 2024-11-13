// Function to encode Uint8Array to base64 string
export const encodeUpdate = (update: Uint8Array): string => {
  const binary = String.fromCharCode(...update);
  return btoa(binary);
};

// Function to decode base64 string to Uint8Array
export const decodeUpdate = (update: string): Uint8Array => {
  const binary = atob(update);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return array;
};
