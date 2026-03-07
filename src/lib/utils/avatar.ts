/**
 * Generates a dicebear adventurer avatar URL from an arbitrary seed string.
 * Used wherever a user doesn't have a real profile picture (mock data, fallbacks).
 */
export const avatarBg = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;
