import test from "node:test";
import assert from "node:assert/strict";
import {
  wireSchema,
  parseSchema,
  attachRemarks,
  format,
  check,
  parsePopulation,
  validatePopulation,
} from "../dist/runtime.js";

const SCHEMA =
  "SCHEMA demo;\nENTITY e;\n  a : STRING;\n  (*\"demo.e\" the note *)\nEND_ENTITY;\nEND_SCHEMA;\n";
const POPULATION =
  "ISO-10303-21;\nHEADER;\nFILE_NAME('x');\nENDSEC;\nDATA;\n#1=E('v');\nENDSEC;\nEND-ISO-10303-21;\n";

test("wireSchema inventories declarations and drives the round trip", () => {
  const wire = wireSchema(SCHEMA);
  const schema = wire.schemas[0];
  assert.equal(schema.id, "demo");

  const attached = attachRemarks(wire, SCHEMA);
  const text = format(attached);
  assert.match(text, /SCHEMA demo;/);
  const stripped = format(attached, true);
  assert.match(stripped, /END_ENTITY;/);
  assert.ok(Array.isArray(check(wire)));
});

test("parseSchema returns the compact inventory view", () => {
  const schemas = parseSchema(SCHEMA);
  assert.equal(schemas[0].name, "demo");
  assert.deepEqual(schemas[0].entities[0].attributes, ["a"]);
});

test("population parse + validate", () => {
  const population = parsePopulation(POPULATION);
  assert.deepEqual(
    new Set(population.records.map((r) => r.keyword)),
    new Set(["E"]),
  );
  const verdict = validatePopulation(["E"], POPULATION);
  assert.equal(verdict.valid, true);
  assert.equal(validatePopulation(["NotE"], POPULATION).valid, false);
});
