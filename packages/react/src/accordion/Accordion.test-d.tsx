/**
 * Compile-time conformance test: the Figma `Expanded` axis is the
 * accordion's `value`, `Interaction` is a skin rather than a prop, and
 * the row's two text slots are both required.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening either props type breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Accordion, AccordionItem } from './Accordion'

// Accepted — the drawn default: three rows, the first one open.
export const basic = (
  <Accordion defaultValue={['made-of']}>
    <AccordionItem value="made-of" title="What is Steelbook made of?">
      Two colors, one accent, a 4px grid.
    </AccordionItem>
    <AccordionItem value="dark-mode" title="Does it support dark mode?">
      Every token is bound.
    </AccordionItem>
  </Accordion>
)

// Accepted — Interaction=Disabled is the prop Ark forwards to the button.
export const disabled = (
  <AccordionItem value="corners" title="Can I round the corners?" disabled>
    No.
  </AccordionItem>
)

// Accepted — more than one row open at a time is Ark's, not a redraw.
export const multiple = <Accordion multiple collapsible />

// @ts-expect-error — Expanded is the accordion's value, not a prop on the row.
export const expandedAsProp = <AccordionItem value="a" title="A" expanded>B</AccordionItem>

// @ts-expect-error — Hover is `:hover`; there is no interaction prop.
export const interactionAsProp = <AccordionItem value="a" title="A" interaction="Hover">B</AccordionItem>

// @ts-expect-error — the row is a button, and a button with no label has no name.
export const titleless = <AccordionItem value="a">B</AccordionItem>

// @ts-expect-error — a row with no answer has nothing to reveal.
export const bodyless = <AccordionItem value="a" title="A" />

// @ts-expect-error — Ark keys every row by value; without one it cannot open.
export const valueless = <AccordionItem title="A">B</AccordionItem>
