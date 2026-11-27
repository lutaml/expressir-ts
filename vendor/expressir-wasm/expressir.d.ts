/* tslint:disable */
/* eslint-disable */

export function attach_remarks(wire_json: string, source: string, annotations: boolean): string;

export function check(wire_json: string, dialect?: string | null): string;

export function concat_schema(repository_wire: string, root_id: string): string;

export function coverage(wire_json: string, skip_types_json: string): string;

export function diff_population(base: string, revised: string): string;

export function flatten_schema(repository_wire: string, root_id: string, longform_name: string): string;

export function format(wire_json: string, no_remarks: boolean): string;

export function lsp_inventory(source: string): string;

export function lsp_rename_edits(source: string, path: string): string;

export function lsp_symbols(source: string): string;

export function parse_population(source: string): string;

export function parse_population_recovering(source: string): string;

export function parse_schema(source: string): string;

export function population_wire_json(source: string): string;

export function resolve(wire_json: string): string;

export function round_trip_population(source: string): string;

export function scan_ascii(source: string, check_remarks: boolean): string;

export function type_population(schema_wire: string, schema_index: number, source: string): string;

export function uos_xml(population_json: string, schema_json: string, options_json: string): string;

export function validate_population(entities_json: string, source: string): string;

export function validate_population_semantic(schema_wire: string, schema_index: number, source: string): string;

export function wire_schema(source: string): string;

export function xsd_xml(schema_json: string): string;
