export function truncateToSentence(
    text: string | null | undefined,
    maxLength = 90
): string {
    if (!text) return "Без описания";

    const normalized = text.trim().replace(/\s+/g, " ");
    if (normalized.length <= maxLength) return normalized;

    const slice = normalized.slice(0, maxLength);
    const sentenceEnd = slice.search(/[.!?](?:\s|$)/);

    if (sentenceEnd > 20) {
        return slice.slice(0, sentenceEnd + 1).trim();
    }

    const lastSpace = slice.lastIndexOf(" ");
    const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
    return `${cut.trim()}…`;
}
