/**
 * Compile-time conformance test: `Selected` is the group's value and
 * `Interaction` is a skin, so neither reaches a cell as a prop, and a
 * cell always carries its label.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening either prop type breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Segment, SegmentGroup } from './SegmentGroup'

// Accepted — the drawn default: three fused cells, the first selected.
export const basic = (
  <SegmentGroup defaultValue="monthly" aria-label="Billing period">
    <Segment value="monthly">Monthly</Segment>
    <Segment value="quarterly">Quarterly</Segment>
    <Segment value="yearly">Yearly</Segment>
  </SegmentGroup>
)

// Accepted — Selected is the group's value, controlled here.
export const controlled = (
  <SegmentGroup value="yearly" onValueChange={({ value }) => void value} aria-label="Billing period">
    <Segment value="yearly">Yearly</Segment>
  </SegmentGroup>
)

// Accepted — Interaction=Disabled on one cell or on the whole group.
export const disabled = (
  <SegmentGroup disabled aria-label="Billing period">
    <Segment value="monthly" disabled>
      Monthly
    </Segment>
  </SegmentGroup>
)

// @ts-expect-error — the label is the cell; it is required.
export const unlabelledSegment = <Segment value="monthly" />

// @ts-expect-error — Selected is the group's value, not a prop on the cell.
export const selectedAsProp = <Segment value="monthly" selected>Monthly</Segment>

// @ts-expect-error — Hover is a skin and Disabled an attribute; neither is an interaction prop.
export const interactionAsProp = <Segment value="monthly" interaction="Hover">Monthly</Segment>
