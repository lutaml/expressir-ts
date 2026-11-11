# expressir-ts

TypeScript/wasm runtime for [Expressir](https://github.com/lutaml/expressir):
EXPRESS schema parse, remark attach, format, check, and the
ISO 10303-21 population — the [expressir-rs](https://github.com/lutaml/expressir-rs)
core compiled to wasm, the same engine the ruby, rust, C, and python
tiers use.

```js
import { wireSchema, attachRemarks, format, parsePopulation, validatePopulation } from "expressir";

const wire = wireSchema("SCHEMA demo; ENTITY e; a : STRING; END_ENTITY; END_SCHEMA;");
console.log(format(attachRemarks(wire, source)));

const verdict = validatePopulation(["E"], populationSource);
```

`wireSchema` returns the model-hash wire (what attach/format/check
consume, the same shape the C ABI's `expr_parse_schema` returns);
`parseSchema` is the compact declaration-inventory view.

## Development

```sh
git clone --recurse-submodules https://github.com/lutaml/expressir-ts
cd expressir-ts
npm run refresh-wasm   # rebuilds vendor/expressir-wasm from the pinned submodule
npm install && npm test
```

## Architecture

One core (`expressir-rs`), many tiers: rust, C (`expr_*` family),
wasm (here), ruby (`expressir`), python (`expressir-python`). Every
tier exposes the same operations over the model-hash wire JSON. See
[expressir.org](https://expressir.org).
