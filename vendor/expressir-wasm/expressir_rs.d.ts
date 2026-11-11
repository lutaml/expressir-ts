/* tslint:disable */
/* eslint-disable */

export function attach_remarks(wire_json: string, source: string, annotations: boolean): string;

export function check(wire_json: string, dialect?: string | null): string;

export function format(wire_json: string, no_remarks: boolean): string;

export function parse_population(source: string): string;

export function parse_schema(source: string): string;

export function validate_population(entities_json: string, source: string): string;

export function wire_schema(source: string): string;
