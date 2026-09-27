import test from "node:test";
import assert from "node:assert/strict";
import { isValidTimezone } from "../src/utils/timezone.js";

test("accepts a valid IANA timezone", () => {
  assert.equal(isValidTimezone("Asia/Kolkata"), true);
});

test("rejects an invalid timezone", () => {
  assert.equal(isValidTimezone("Asia/NotARealZone"), false);
});
