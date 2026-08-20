/**
 * Compile-time conformance test: Figma's `Interaction` axis is CSS, its
 * `Type` axis splits into a `tone` and the native disabled route, the
 * two `Show …` booleans are the presence of `icon` / `shortcut`, and the
 * trigger is the caller's own element.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening MenuProps or MenuItemProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Menu, MenuItem, MenuSeparator } from './Menu'
import { PenIcon } from '../icons/PenIcon'
import { TrashIcon } from '../icons/TrashIcon'

// Accepted — the drawn menu: three rows, a rule, a danger row.
export const basic = (
  <Menu trigger={<button type="button">Actions</button>}>
    <MenuItem value="rename" icon={<PenIcon />} shortcut="⌘R">
      Rename
    </MenuItem>
    <MenuSeparator />
    <MenuItem value="delete" tone="danger" icon={<TrashIcon />} shortcut="⌫">
      Delete
    </MenuItem>
  </Menu>
)

// Accepted — Show icon=false and Show shortcut=false are simply omission.
export const bare = <MenuItem value="rename">Rename</MenuItem>

// Accepted — Type=Disabled arrives as the disabled prop, as Button's does.
export const disabled = <MenuItem value="rename" disabled>Rename</MenuItem>

// Accepted — selection and open state are the caller's to control.
export const controlled = <Menu trigger={<button type="button">Actions</button>} open onSelect={({ value }) => void value}><MenuItem value="a">A</MenuItem></Menu>

// @ts-expect-error — Hover is CSS (data-highlighted), never a prop.
export const interactionAsProp = <MenuItem value="rename" interaction="Hover">Rename</MenuItem>

// @ts-expect-error — Disabled is a state, so it is not one of the tones.
export const disabledAsTone = <MenuItem value="rename" tone="disabled">Rename</MenuItem>

// @ts-expect-error — every row needs a value; it is what selection reports.
export const valueless = <MenuItem>Rename</MenuItem>

// @ts-expect-error — the row is nothing without its label.
export const labelless = <MenuItem value="rename" />

// @ts-expect-error — the menu cannot open itself; a trigger is required.
export const triggerless = <Menu><MenuItem value="a">A</MenuItem></Menu>

// @ts-expect-error — the trigger replaces Ark's button, so it must be one element.
export const textTrigger = <Menu trigger="Actions"><MenuItem value="a">A</MenuItem></Menu>
