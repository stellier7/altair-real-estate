import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  dedupePreserveOrder,
  moveGalleryItem,
  moveItem,
  parseGalleryLines,
  serializeGalleryLines,
} from "./gallery-order";

describe("parseGalleryLines / serializeGalleryLines", () => {
  it("trims and drops empty lines", () => {
    assert.deepEqual(parseGalleryLines("  a\n\n b \n"), ["a", "b"]);
  });

  it("round-trips order", () => {
    const urls = ["https://a.test/1.jpg", "https://a.test/2.jpg"];
    assert.deepEqual(parseGalleryLines(serializeGalleryLines(urls)), urls);
  });
});

describe("moveItem / moveGalleryItem", () => {
  it("moves forward and backward", () => {
    assert.deepEqual(moveGalleryItem(["a", "b", "c", "d"], 0, 3), [
      "b",
      "c",
      "d",
      "a",
    ]);
    assert.deepEqual(moveGalleryItem(["a", "b", "c", "d"], 3, 0), [
      "d",
      "a",
      "b",
      "c",
    ]);
    assert.deepEqual(moveItem(["a", "b", "c"], 1, 2), ["a", "c", "b"]);
  });

  it("returns the same reference for no-ops and out-of-bounds", () => {
    const items = ["a", "b", "c"];
    assert.equal(moveItem(items, 1, 1), items);
    assert.equal(moveItem(items, -1, 0), items);
    assert.equal(moveItem(items, 0, 9), items);
  });
});

describe("dedupePreserveOrder", () => {
  it("keeps the first occurrence", () => {
    assert.deepEqual(dedupePreserveOrder(["a", "b", "a", "c", "b"]), [
      "a",
      "b",
      "c",
    ]);
  });
});
