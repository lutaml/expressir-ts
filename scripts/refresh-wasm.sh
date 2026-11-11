#!/usr/bin/env bash
# Rebuild the vendored wasm from expressir-rs main and update BUILT_FROM.
# Requires wasm-pack (--target=nodejs) and rustup's wasm32-unknown-unknown target.
set -eu
HERE="$(cd "$(dirname "$0")/.." && pwd)"
RS="${EXPRESSIR_RS:-$HERE/expressir-rs}"

export PATH="$HOME/.cargo/bin:$PATH"
cd "$RS"
rm -rf pkg
wasm-pack build --release --target=nodejs

# The glue ships as CommonJS under this package's "type": "module".
cp pkg/expressir_rs_bg.wasm pkg/expressir_rs_bg.wasm.d.ts pkg/expressir_rs.d.ts \
   "$HERE/vendor/expressir-wasm/"
cp pkg/expressir_rs.js "$HERE/vendor/expressir-wasm/expressir_rs.cjs"
rm -f "$HERE/vendor/expressir-wasm/expressir_rs.js"
git -C "$RS" rev-parse HEAD > "$HERE/vendor/expressir-wasm/BUILT_FROM"
echo "built with: wasm-pack build --target=nodejs (from expressir-rs)" \
  >> "$HERE/vendor/expressir-wasm/BUILT_FROM"
