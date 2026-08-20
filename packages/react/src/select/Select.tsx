import { useMemo, type ReactNode } from 'react'
import {
  Select as ArkSelect,
  createListCollection,
  type SelectRootProps,
} from '@ark-ui/react/select'
import { CheckIcon } from '../icons/CheckIcon'
import { ChevronsUpDownIcon } from '../icons/ChevronsUpDownIcon'
import type { ListboxItem } from '../listbox/Listbox'
// The dropdown is a Listbox — the Figma "Select / Open" example composes
// an instance of that very component — so its rows are styled by the
// Listbox sheet rather than by a second copy of the same rules.
import '../listbox/Listbox.css'
import './Select.css'

/**
 * One choice. Identical to {@link ListboxItem}, because the dropdown is
 * a Listbox: `label` is the row's text, `disabled` its
 * `Interaction=Disabled` variant, `value` what selection reports.
 */
export type SelectItem = ListboxItem

/**
 * The gap Figma draws between the trigger and the dropdown in the
 * "Select / Open" example. Not on the space scale and bound to nothing,
 * so it is carried here and flagged; Ark's own default would be 8.
 */
const SELECT_GUTTER = 6

export type SelectProps = Omit<SelectRootProps<SelectItem>, 'children' | 'collection'> & {
  /**
   * The label above the trigger. Required — every variant of the Figma
   * component draws it, and it is what names the combobox.
   */
  label: ReactNode
  /** The choices, in order. */
  items: SelectItem[]
  /**
   * Figma's `Value` text property, which every drawn variant fills with
   * "Choose material…" — the text shown while nothing is selected.
   */
  placeholder?: string
  /** Appended after the control's own class, on the drawn column. */
  className?: string
}

/**
 * A dropdown: a labelled trigger that opens a Listbox of choices. Ark
 * drives opening, selection, keyboard navigation, typeahead, focus and
 * the ARIA; the visual design stays as drawn.
 *
 * Both Figma components live here. `Select / Open` is not a second
 * component but the same one rendered open, so it ships as the open
 * state rather than as an export of its own — and the Listbox it
 * composes is styled by the Listbox sheet, not re-drawn.
 *
 * The `State` axis maps the way Field's does: `Open` is the machine's
 * (`data-state="open"`), `Disabled` is the native attribute, and
 * neither is a prop. There is no drawn Focus state, so a trigger
 * focused but still closed takes the Open skin — the 3px accent border
 * — which is the same treatment Field gives a focused input.
 *
 * Three decisions the design did not make:
 *
 * - **The control fills its container.** Figma fixes the frame at
 *   260px, but so does Field's at 320px, and Field ships filling its
 *   container. A form control's width is the form's business.
 * - **The dropdown does not.** It stays at the Listbox's drawn 240px,
 *   which the frame draws narrower than its own 260px trigger. Flagged
 *   in Figma: it may be meant to match the trigger instead.
 * - **The value darkens when open.** Figma draws the same placeholder
 *   string in `text/placeholder` when closed and `text/primary` when
 *   open, so that is what ships. No variant is drawn for "closed with a
 *   value chosen"; that case takes `text/primary`, the only other ink
 *   the design offers.
 *
 * Not portalled: the Positioner is placed where the select is written,
 * so an `overflow: hidden` ancestor will clip the dropdown. Wrap it in
 * Ark's `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Material"
 *   placeholder="Choose material…"
 *   items={[
 *     { value: 'gunmetal', label: 'Gunmetal' },
 *     { value: 'concrete', label: 'Concrete' },
 *   ]}
 *   onValueChange={({ value }) => setMaterial(value[0])}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Select (node `37:48`) and Select /
 * Open (node `37:49`).
 * Built on [Ark UI Select](https://ark-ui.com/docs/components/select).
 */
export function Select({
  label,
  items,
  placeholder,
  className,
  positioning = { gutter: SELECT_GUTTER },
  ...props
}: SelectProps) {
  const collection = useMemo(() => createListCollection({ items }), [items])

  return (
    <ArkSelect.Root
      {...props}
      collection={collection}
      positioning={positioning}
      className={className ? `sb-select ${className}` : 'sb-select'}
    >
      <ArkSelect.Label className="sb-select__label">{label}</ArkSelect.Label>
      <ArkSelect.Control className="sb-select__control">
        <ArkSelect.Trigger className="sb-select__trigger">
          <ArkSelect.ValueText className="sb-select__value" placeholder={placeholder} />
          <ArkSelect.Indicator className="sb-select__indicator">
            <ChevronsUpDownIcon />
          </ArkSelect.Indicator>
        </ArkSelect.Trigger>
      </ArkSelect.Control>
      <ArkSelect.Positioner>
        <ArkSelect.Content className="sb-listbox sb-select__content">
          <ArkSelect.ItemGroup className="sb-select__group">
            {items.map((item) => (
              <ArkSelect.Item key={item.value} item={item} className="sb-listbox__option">
                <ArkSelect.ItemText className="sb-listbox__label">{item.label}</ArkSelect.ItemText>
                <ArkSelect.ItemIndicator className="sb-listbox__check">
                  <CheckIcon />
                </ArkSelect.ItemIndicator>
              </ArkSelect.Item>
            ))}
          </ArkSelect.ItemGroup>
        </ArkSelect.Content>
      </ArkSelect.Positioner>
      {/* Undrawn, and invisible: the native <select> Ark keeps in sync so
          the control submits with a form and takes part in its reset. */}
      <ArkSelect.HiddenSelect />
    </ArkSelect.Root>
  )
}
