import assert from "node:assert/strict";
import test from "node:test";
import {
  propertyEditorPath,
  shouldOpenSavedProperty,
} from "./editor-navigation";

test("saving a new property opens its editor without reloading the same page", () => {
  const savedTo = propertyEditorPath("p-1794256301039");

  assert.equal(savedTo, "/admin/properties/p-1794256301039");
  assert.equal(
    shouldOpenSavedProperty("/admin/properties/new", savedTo),
    true,
  );
  assert.equal(shouldOpenSavedProperty(savedTo, savedTo), false);
  assert.equal(shouldOpenSavedProperty(`${savedTo}/`, savedTo), false);
});
