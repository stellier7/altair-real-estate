const NEW_ITEM_RE = /^(?:[-*•▪▸►‣·]|\d+[.)])\s+\S/;
const HEADING_RE = /^.{0,80}:\s*$/;
/** Next line continues a sentence that Wasi wrapped with a hard break. */
const CONTINUATION_START_RE = /^[a-záéíóúüñ]/;
const DANGLING_WORD_RE =
  /(?:^|[\s(])(?:y|e|o|u|de|del|al|el|la|los|las|en|con|por|para|más|mas|un|una|su|sus|que|a)\s*$/i;

function collapseBlock(block: string): string {
  return block.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function isNewItem(line: string): boolean {
  return NEW_ITEM_RE.test(line) || HEADING_RE.test(line);
}

/**
 * Wasi often stores a line break in the middle of a sentence. Those fragments
 * were rendered as separate facts and, in two columns, sat beside unrelated lines.
 */
function shouldJoinWrappedLine(previous: string, next: string): boolean {
  if (isNewItem(next) || HEADING_RE.test(previous)) {
    return false;
  }
  if (CONTINUATION_START_RE.test(next)) {
    return true;
  }
  return DANGLING_WORD_RE.test(previous);
}

/** Split long property copy into blocks (Wasi exports use blank lines between facts). */
export function splitDescriptionParagraphs(text: string): string[] {
  const lines = text
    .split(/\n\s*\n/)
    .map(collapseBlock)
    .filter(Boolean);

  const merged: string[] = [];
  for (const line of lines) {
    const previous = merged[merged.length - 1];
    if (previous && shouldJoinWrappedLine(previous, line)) {
      merged[merged.length - 1] = `${previous} ${line}`.replace(/\s+/g, " ").trim();
      continue;
    }
    merged.push(line);
  }
  return merged;
}

/** Paragraphs separated by a blank line, with mid-sentence wraps repaired. */
export function normalizeDescriptionText(text: string): string {
  return splitDescriptionParagraphs(text).join("\n\n");
}

/** Most Altair listings use many short fact lines rather than essay paragraphs. */
export function isListLikeDescription(blocks: string[]): boolean {
  if (blocks.length < 3) {
    return false;
  }
  const shortBlocks = blocks.filter((block) => block.length <= 96).length;
  return shortBlocks / blocks.length >= 0.55;
}
