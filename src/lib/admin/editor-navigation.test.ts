import assert from "node:assert/strict";
import test from "node:test";
import { propertyEditorPath } from "./editor-navigation";

test("a saved property links back to its panel page", () => {
  assert.equal(
    propertyEditorPath("p-1794256301039"),
    "/admin/properties/p-1794256301039",
  );
  assert.equal(
    propertyEditorPath("id with spaces"),
    "/admin/properties/id%20with%20spaces",
  );
});
