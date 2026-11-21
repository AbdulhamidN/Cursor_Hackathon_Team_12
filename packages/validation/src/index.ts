// Cross-cutting schemas only. Each module's schemas live in
// `./modules/<module>.ts` (created by the module owner when first needed) and
// are imported as `@ecb/validation/<module>`, so nobody needs to edit this file.
export * from './common';
