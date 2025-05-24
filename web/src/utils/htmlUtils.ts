/**
 * Strips HTML tags from text and trims if too long
 * @param html - HTML content to process
 * @param maxLength - Maximum length before trimming (default: 50)
 * @returns Plain text without HTML tags, trimmed if needed
 */
export const stripHtmlAndTrim = (html: string, maxLength: number = 50): string => {
  if (!html) return '';
  // Create a temporary div element
  const tempDiv = document.createElement('div');
  // Set its HTML content to the provided string
  tempDiv.innerHTML = html;
  // Get the text content without HTML tags
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // Trim the text if it's too long
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + '...';
  }
  return plainText;
};

/**
 * Truncates HTML content while preserving tag structure
 * @param html - HTML content to truncate
 * @param maxLength - Maximum length before truncating (default: 150)
 * @returns Truncated HTML with preserved structure
 */
export const truncateHtml = (html: string, maxLength: number = 150): string => {
  if (!html) return '';

  // Create a temporary div element
  const tempDiv = document.createElement('div');
  // Set its HTML content to the provided string
  tempDiv.innerHTML = html;

  // Get the plain text content
  const plainText = tempDiv.textContent || tempDiv.innerText || '';

  // If the text is already shorter than maxLength, return the original HTML
  if (plainText.length <= maxLength) {
    return html;
  }

  // Find a good breaking point (word boundary) near maxLength
  let breakPoint = plainText.lastIndexOf(' ', maxLength);
  if (breakPoint === -1) breakPoint = maxLength;

  // Now we need to truncate the HTML intelligently
  let currentLength = 0;
  let truncatedHtml = '';
  let openTags: string[] = [];

  // Tokenize the HTML
  const tokenizer = /<[^>]+>|[^<]+/g;
  let match: RegExpExecArray | null;
  let shouldContinue = true;

  while ((match = tokenizer.exec(html)) !== null && shouldContinue) {
    const token = match[0];

    if (token.startsWith('<')) {
      // Handle HTML tags
      if (token.startsWith('</')) {
        // Closing tag
        const tagName = token.match(/<\/([a-zA-Z0-9]+)/)?.[1]?.toLowerCase();
        if (tagName && openTags.length > 0 && openTags[openTags.length - 1] === tagName) {
          openTags.pop();
        }
        truncatedHtml += token;
      } else if (!token.endsWith('/>')) {
        // Opening tag (not self-closing)
        const tagName = token.match(/<([a-zA-Z0-9]+)/)?.[1]?.toLowerCase();
        if (tagName) {
          openTags.push(tagName);
        }
        truncatedHtml += token;
      } else {
        // Self-closing tag
        truncatedHtml += token;
      }
    } else {
      // Text content
      if (currentLength + token.length > breakPoint) {
        // We need to truncate this text node
        const remainingLength = breakPoint - currentLength;
        truncatedHtml += token.substring(0, remainingLength) + '...';
        shouldContinue = false;
      } else {
        truncatedHtml += token;
        currentLength += token.length;
      }
    }
  }

  // Close any open tags
  for (let i = openTags.length - 1; i >= 0; i--) {
    truncatedHtml += `</${openTags[i]}>`;
  }

  return truncatedHtml;
};
