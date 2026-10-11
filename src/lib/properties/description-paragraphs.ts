/** Split long property copy into blocks (Wasi exports use blank lines between facts). */
export function splitDescriptionParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Most Altair listings use many short fact lines rather than essay paragraphs. */
export function isListLikeDescription(blocks: string[]): boolean {
  if (blocks.length < 3) {
    return false;
  }
  const shortBlocks = blocks.filter((block) => block.length <= 96).length;
  return shortBlocks / blocks.length >= 0.55;
}
