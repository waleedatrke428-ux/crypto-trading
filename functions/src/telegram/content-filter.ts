export class ContentFilter {
  private forbiddenWords: string[] = [
    // Spam words
    'spam', 'scam', 'fake', 'fraud',
    // Inappropriate content
    'porn', 'xxx', 'adult',
    // Hate speech patterns
    'hate', 'kill', 'terror',
    // Scam patterns
    'double your money', 'guaranteed profit', '100% win',
    // Arabic forbidden words
    'احتيال', 'نصب', 'مزيف', 'إباحي'
  ];

  private suspiciousPatterns: RegExp[] = [
    // Multiple links
    /(https?:\/\/[^\s]+)/gi,
    // Phone numbers
    /\+?\d{10,}/g,
    // Email addresses
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // All caps (possible spam)
    /^[A-Z\s]{10,}$/
  ];

  // Check if content is allowed
  isContentAllowed(content: string): boolean {
    const lowerContent = content.toLowerCase();

    // Check for forbidden words
    for (const word of this.forbiddenWords) {
      if (lowerContent.includes(word)) {
        return false;
      }
    }

    // Check for suspicious patterns
    let linkCount = 0;
    let phoneCount = 0;
    let emailCount = 0;

    for (const pattern of this.suspiciousPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        if (pattern.toString().includes('https')) {
          linkCount = matches.length;
        } else if (pattern.toString().includes('\\d{10}')) {
          phoneCount = matches.length;
        } else if (pattern.toString().includes('@')) {
          emailCount = matches.length;
        }
      }
    }

    // Reject if too many links, phones, or emails
    if (linkCount > 2 || phoneCount > 1 || emailCount > 1) {
      return false;
    }

    // Check for all caps spam
    if (content.length > 10 && content === content.toUpperCase()) {
      return false;
    }

    return true;
  }

  // Sanitize content
  sanitizeContent(content: string): string {
    let sanitized = content;

    // Remove multiple consecutive spaces
    sanitized = sanitized.replace(/\s{2,}/g, ' ');

    // Remove excessive line breaks
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

    return sanitized.trim();
  }

  // Extract trading-related content
  extractTradingInfo(content: string): {
    pair?: string;
    action?: 'BUY' | 'SELL';
    price?: number;
  } {
    const info: any = {};

    // Extract trading pair (e.g., BTC/USDT)
    const pairMatch = content.match(/[A-Z]{3,6}\/[A-Z]{3,6}/i);
    if (pairMatch) {
      info.pair = pairMatch[0].toUpperCase();
    }

    // Extract action
    if (content.toLowerCase().includes('buy') || content.includes('شراء')) {
      info.action = 'BUY';
    } else if (content.toLowerCase().includes('sell') || content.includes('بيع')) {
      info.action = 'SELL';
    }

    // Extract price
    const priceMatch = content.match(/\$?\d+\.?\d*/g);
    if (priceMatch && priceMatch.length > 0) {
      const price = parseFloat(priceMatch[0].replace('$', ''));
      if (!isNaN(price) && price > 0) {
        info.price = price;
      }
    }

    return info;
  }
}
