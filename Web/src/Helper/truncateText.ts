/**
 * Truncates a string to a specified maximum length, appending an ellipsis if it exceeds the limit.
 *
 * @param text The input string to truncate
 * @param maxLength The maximum allowed length before truncation (defaults to 70)
 * @param ellipsis The string to append when truncated (defaults to "...")
 * @returns The truncated string
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50,
  ellipsis: string = "...",
): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}${ellipsis}`;
};

export default truncateText;
