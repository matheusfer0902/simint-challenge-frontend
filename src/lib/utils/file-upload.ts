export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
] as const;

export const MAX_SPRITE_SIZE_BYTES = 30 * 1024 * 1024; // 30MB

const SIGNATURES: { bytes: number[]; offset: number }[] = [
  { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }, // PNG
  { offset: 0, bytes: [0xff, 0xd8, 0xff] }, // JPEG
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
];

const WEBP_RIFF_HEAD = [0x52, 0x49, 0x46, 0x46]; // RIFF
const WEBP_RIFF_TAIL = [0x57, 0x45, 0x42, 0x50]; // "WEBP" em offset 8

export interface SpriteUploadValidationResult {
  valid: true;
  file: File;
}

export interface SpriteUploadValidationError {
  valid: false;
  error: string;
}

export type SpriteUploadValidation =
  | SpriteUploadValidationResult
  | SpriteUploadValidationError;

function arrayBufferEquals(a: ArrayBuffer, b: number[], offset = 0): boolean {
  const view = new Uint8Array(a, offset, b.length);
  for (let i = 0; i < b.length; i++) {
    if (view[i] !== b[i]) return false;
  }
  return true;
}

async function validateMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();

  if (arrayBufferEquals(buffer, WEBP_RIFF_HEAD, 0) && arrayBufferEquals(buffer, WEBP_RIFF_TAIL, 8)) {
    return true;
  }

  for (const { offset, bytes } of SIGNATURES) {
    if (arrayBufferEquals(buffer, bytes, offset)) return true;
  }

  return false;
}

export async function validateSpriteUpload(file: File | null): Promise<SpriteUploadValidation> {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      error: "Format not allowed. Use PNG, JPEG, GIF or WebP.",
    };
  }

  if (file.size > MAX_SPRITE_SIZE_BYTES) {
    return {
      valid: false,
      error: "File too large. The maximum size is 30 MB.",
    };
  }

  const isValidImage = await validateMagicBytes(file);
  if (!isValidImage) {
    return {
      valid: false,
      error: "The file does not seem to be a valid image. Send PNG, JPEG, GIF or WebP.",
    };
  }

  return { valid: true, file };
}
