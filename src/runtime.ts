//! The Expressir wasm runtime for TypeScript: the vendored
//! expressir-rs wasm build exposes the same six operations every
//! tier exposes — parse_schema, attach_remarks, format, check,
//! parse_population, validate_population — JSON in, JSON out.
//! No EXPRESS code lives in this package; the engine build is the
//! contract (vendor/expressir-wasm/BUILT_FROM pins it).

import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface WasmExpressir {
  wire_schema(source: string): string;
  parse_schema(source: string): string;
  attach_remarks(wire_json: string, source: string, annotations: boolean): string;
  format(wire_json: string, no_remarks: boolean): string;
  check(wire_json: string, dialect: string | null): string;
  parse_population(source: string): string;
  validate_population(entities_json: string, source: string): string;
}

export interface PopulationRecord {
  id: number;
  keyword: string;
  complex: boolean;
}

export interface Population {
  file_schemas: string[];
  records: PopulationRecord[];
  anchors: string[][];
  references: string[];
}

export interface Verdict {
  valid: boolean;
  errors: string[];
}

export interface Finding {
  [key: string]: unknown;
}

/** Walk up from this module to the package root (which holds package.json). */
function packageRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (; !existsSync(join(dir, "package.json")); dir = dirname(dir)) {
    if (dir === dirname(dir)) {
      throw new Error("package.json not found above the expressir runtime");
    }
  }
  return dir;
}

// The vendored wasm glue is CommonJS and lives outside the compiled tree;
// loading is deferred to the first engine call: importing this module
// costs nothing, and the wasm compiles only when parsing is real.
const require = createRequire(import.meta.url);
let wasmModule: WasmExpressir | null = null;

function wasm(): WasmExpressir {
  if (wasmModule === null) {
    wasmModule = require(
      join(packageRoot(), "vendor", "expressir-wasm", "expressir_rs.cjs"),
    ) as WasmExpressir;
  }
  return wasmModule;
}

function parseJson<T>(text: string, what: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error(`the engine returned invalid ${what} JSON: ${String(error)}`);
  }
}

/** Parses an EXPRESS schema into the model-hash wire object — the
 * shape attachRemarks/format/check consume (the C ABI's
 * expr_parse_schema output). */
export function wireSchema(source: string): Record<string, unknown> {
  return parseJson(wasm().wire_schema(source), "schema wire");
}

/** Parses an EXPRESS schema into a declaration inventory (schema
 * name + entity names + per-entity attribute names) — the compact
 * browser-oriented summary view. */
export function parseSchema(source: string): Record<string, unknown> {
  return parseJson(wasm().parse_schema(source), "schema wire");
}

/** Attaches tagged + untagged remarks to a wire. */
export function attachRemarks(
  wire: Record<string, unknown> | string,
  source: string,
  annotations = false,
): Record<string, unknown> {
  const wireJson = typeof wire === "string" ? wire : JSON.stringify(wire);
  return parseJson(wasm().attach_remarks(wireJson, source, annotations), "attached wire");
}

/** Formats a wire to EXPRESS text; `noRemarks` strips remarks. */
export function format(wire: Record<string, unknown> | string, noRemarks = false): string {
  const wireJson = typeof wire === "string" ? wire : JSON.stringify(wire);
  return wasm().format(wireJson, noRemarks);
}

/** Runs the checker over a wire; returns the findings array. */
export function check(
  wire: Record<string, unknown> | string,
  dialect: string | null = null,
): Finding[] {
  const wireJson = typeof wire === "string" ? wire : JSON.stringify(wire);
  return parseJson(wasm().check(wireJson, dialect), "findings");
}

/** Parses an ISO-10303-21 population into its structural inventory. */
export function parsePopulation(source: string): Population {
  return parseJson(wasm().parse_population(source), "population inventory");
}

/** Validates a population's records against an entity inventory. */
export function validatePopulation(entities: string[], source: string): Verdict {
  return parseJson(
    wasm().validate_population(JSON.stringify(entities), source),
    "verdict",
  );
}
