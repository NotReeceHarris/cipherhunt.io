export function splitIntoParagraphs(text: string, maxLength: number = 300): string[] {
    if (typeof text !== 'string') {
        return [];
    }

    // Normalise whitespace
    const cleaned = text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();

    if (!cleaned) {
        return [];
    }

    // Split into sentences
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

    const paragraphs = [];
    let current = '';

    for (const sentence of sentences) {
        const trimmed = sentence.trim();

        // Start new paragraph if adding this sentence exceeds max length
        if ((current + ' ' + trimmed).trim().length > maxLength) {
        if (current) {
            paragraphs.push(current.trim());
        }

        current = trimmed;
        } else {
        current += ` ${trimmed}`;
        }
    }

    // Push remaining paragraph
    if (current.trim()) {
        paragraphs.push(current.trim());
    }

    return paragraphs;
}