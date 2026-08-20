# Steelbook — working agreement

Steelbook is a design system built from a Figma file. **Figma is the source of
truth.** Code implements what the design specifies; it does not invent, improve,
or reinterpret it. When the design is silent on something, say so and ask —
don't fill the gap and move on.

Figma file: `Steelbook Design System`
`https://www.figma.com/design/h612G7BPMLOPKHKKGec18l/Steelbook-Design-System`

---

## Where the contract lives

Read the **component description** before writing anything. It carries the
binding rules: which primitive to build on, how Figma properties map to props,
what the defaults are, and any conformance requirements. It is authoritative.

Annotations on the canvas carry build-time context — links, rationale,
implementation notes. Read them, but the description wins on conflict.

**Descriptions change.** On any update task, re-read the description and diff it
against what's implemented. A change there is as real as a change in geometry.

Text style descriptions carry the values Figma's API cannot express — font
family, weight, and the Archivo width axis. Treat them the same way.

---

## Non-negotiables

**Reuse, never regenerate.** Before building anything, check whether it already
exists in `packages/react/src/`. If a component exists, import it. If something
close exists, extend it. Building a second version of an existing component is
a defect, not a shortcut.

**Every value comes from a token.** No hex, no raw px, no font declarations in
component CSS — only `var(--sb-*)` from `packages/tokens/tokens.css`. If the
design uses a value with no token behind it, stop and flag the gap rather than
hardcoding it or snapping to the nearest token. Stylelint enforces this; a
violation fails CI.

**Typography consumes token groups.** Use the full `--sb-text-<style>-*` group
(family / weight / width / size / line-height / tracking). Never re-derive type
from pixel measurements. Width applies via `font-stretch`.

**State variants are CSS, not props.** Figma models Hover / Active / Focus /
Disabled as variant axes because it has no other way to draw them. In code they
are `:hover`, `:active`, `:focus-visible`, and the native `disabled` attribute.
Never expose a `state` prop. Add a type test that fails if one appears.

**Ark UI supplies behavior.** Where a component description names an Ark
primitive, build on it — never reimplement keyboard handling, focus management,
or ARIA. Style via Ark's `data-*` attributes (`data-state`, `data-disabled`,
`data-hover`), not React state. Where the description says there is no Ark
primitive, use the native element.

**Icon-only controls require an accessible name.** No visible text means no
accessible name, and no library can supply one. Enforce it at the type level
with a mutually exclusive union of `aria-label` / `aria-labelledby`, and mark
decorative glyphs `aria-hidden="true"`.

**Assets come from Figma.** Export the real SVG and preserve its path data
verbatim. Recolor via `currentColor` so tokens drive the fill. Never redraw an
icon from memory or substitute a lookalike.

---

## House patterns

- Structure: `packages/react/src/<name>/{<Name>.tsx, <Name>.css, <Name>.test-d.tsx, index.ts}`
- Class names: `sb-<component>` block, `sb-<component>__<part>` element
- Consumer `className` appends after the component's own classes
- Props extend the underlying element's props (`ComponentPropsWithRef<'button'>`
  or the Ark `*RootProps`) so refs and native attributes pass through
- Every component ships a `.test-d.tsx` compile-time test asserting its
  contract — `tsc --noEmit` is the assertion
- JSDoc on the component records the Figma node id and any decision the design
  didn't specify

## Verification before you report done

- `pnpm typecheck` and `pnpm test` pass
- Rendered output measured against the Figma frame, all variants
- State the blast radius: which files changed and why each one had to

## Known gaps — do not silently work around these

- **Font family, weight, and the Archivo width axis** are not readable from
  Figma's API. They live in text style descriptions and in `tokens.css`.
  Changing one means changing both; nothing detects the drift.
- **The 768px breakpoint** exists only in `tokens.css`. No Figma variable
  holds it.
- **Code Connect** is unavailable on this Figma plan. Component descriptions
  carry the code mapping instead.

## Scope

Change what was asked and what that change requires. Unrequested refactors,
reformatting, and drive-by improvements are noise in review — raise them
instead. If something outside scope looks wrong, say so and let the human
decide.
