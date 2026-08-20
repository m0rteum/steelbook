/**
 * Compile-time conformance test: the Figma `Type` axis is decided by the
 * machine from the count, never passed in, and `Interaction` is a skin
 * rather than a prop.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening PaginationProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Pagination } from './Pagination'

// Accepted — the drawn row: twelve pages of ten, sitting on the second.
export const basic = <Pagination count={120} pageSize={10} defaultPage={2} />

// Accepted — how many cells sit either side of the current one, and at the ends.
export const shaped = <Pagination count={500} pageSize={10} siblingCount={2} boundaryCount={1} />

// Accepted — the page is the caller's to control.
export const controlled = <Pagination count={120} page={4} onPageChange={({ page }) => void page} />

// @ts-expect-error — Type is the machine's, computed from the count.
export const typeAsProp = <Pagination count={120} type="Current" />

// @ts-expect-error — Hover is `:hover`; there is no interaction prop.
export const interactionAsProp = <Pagination count={120} interaction="Hover" />

// @ts-expect-error — the cells come from the machine; children are not composed here.
export const withChildren = <Pagination count={120}>extra</Pagination>
