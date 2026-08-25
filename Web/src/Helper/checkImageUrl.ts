/**
 * Checks if an image URL can be loaded without errors (e.g., not 404).
 * Mirrors the browser image loading behavior with `no-referrer`.
 *
 * @param url The image URL to check
 * @returns Promise<boolean> True if loaded successfully, false on 404/load error
 */
export const checkImageUrl = (
  url: string | null | undefined,
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      resolve(true);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = url;
  });
};

export default checkImageUrl;
