import { useMemo, useState, type ReactNode } from 'react'
import {
  Combobox as ArkCombobox,
  createListCollection,
  type ComboboxInputValueChangeDetails,
  type ComboboxRootProps,
} from '@ark-ui/react/combobox'
import { useFilter } from '@ark-ui/react/locale'
import { CheckIcon } from '../icons/CheckIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { SearchIcon } from '../icons/SearchIcon'
import type { ListboxItem } from '../listbox/Listbox'
// The results panel is a Listbox — the Figma "Combobox / Open" example
// draws it with Listbox Option instances at the Listbox's own width,
// inset and stroke — so its rows are styled by the Listbox sheet rather
// than by a second copy of the same rules.
import '../listbox/Listbox.css'
import './Combobox.css'

/**
 * One choice. Identical to {@link ListboxItem}, because the results
 * panel is a Listbox: `label` is the row's text and what the query
 * matches against, `disabled` its `Interaction=Disabled` variant,
 * `value` what selection reports.
 */
export type ComboboxItem = ListboxItem

/**
 * The gap Figma draws between the input and the results panel in the
 * "Combobox / Open" example. Not on the space scale and bound to
 * nothing, so it is carried here and flagged; Ark's own default would
 * be 8.
 */
const COMBOBOX_GUTTER = 6

/**
 * Hoisted so `useFilter`'s memo key stays stable — it keys on the props
 * object's identity, so a literal written inline would rebuild the
 * matcher on every render. `base` sensitivity ignores case and accents,
 * which is what a name search wants.
 */
const FILTER_OPTIONS = { sensitivity: 'base' } as const

export type ComboboxProps = Omit<
  ComboboxRootProps<ComboboxItem>,
  'children' | 'collection'
> & {
  /**
   * The label above the input. Required — every variant of the Figma
   * component draws it, and it is what names the combobox.
   */
  label: ReactNode
  /** The choices, in order, before the query narrows them. */
  items: ComboboxItem[]
  /** Appended after the control's own class, on the drawn column. */
  className?: string
}

/**
 * A type-to-filter select: a labelled text input with a search glyph
 * that narrows a Listbox of choices as you type. Ark drives opening,
 * filtering keyboard navigation, selection, focus and the ARIA; the
 * visual design stays as drawn.
 *
 * Both Figma components live here. `Combobox / Open` is not a second
 * component but the same one rendered open, so it ships as the open
 * state rather than as an export of its own — and the results panel it
 * draws is styled by the Listbox sheet, not re-drawn.
 *
 * The `State` axis maps onto what a text input already does, so none of
 * it is a prop:
 *
 * - **Default** is an empty input: the placeholder renders in
 *   `text/placeholder` through `::placeholder`.
 * - **Filtering** is a focused input with a query in it. Its two drawn
 *   changes are the 3px accent border, which is `[data-focus]` on the
 *   control (Field answers its own Focus state the same way, since a
 *   caret means editing however focus arrived), and the value in
 *   `text/primary`, which is simply real input text rather than the
 *   placeholder.
 * - **Disabled** is the native attribute.
 *
 * Three decisions the design did not make:
 *
 * - **The control fills its container.** Figma fixes the frame at
 *   280px, but so does Field's at 320px, and Field ships filling its
 *   container. A form control's width is the form's business.
 * - **The results panel does not.** It stays at the Listbox's drawn
 *   240px, which the frame draws narrower than its own 280px input.
 *   Flagged in Figma: it may be meant to match the input instead.
 * - **The component filters the items it is given**, matching the query
 *   anywhere in a row's label, case- and accent-insensitively — which
 *   is what the drawn example shows, where "bri" keeps "Gabriel Brito"
 *   on a match inside the word. Callers doing their own (server-side,
 *   say) search should narrow `items` and hold the query themselves.
 *
 * The first hit is highlighted as you type (`inputBehavior:
 * "autohighlight"`, over Ark's default of `"none"`), so Enter takes it
 * without arrowing down first. The open frame draws it that way and the
 * component description says so outright, which makes it drawn
 * behaviour rather than a default worth inheriting.
 *
 * The design draws no empty state, so none ships: a query that matches
 * nothing leaves an empty panel. Raised in Figma.
 *
 * Not portalled: the Positioner is placed where the combobox is
 * written, so an `overflow: hidden` ancestor will clip the panel. Wrap
 * it in Ark's `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <Combobox
 *   label="Assignee"
 *   placeholder="Search people…"
 *   items={[
 *     { value: 'brianna', label: 'Brianna Wolfe' },
 *     { value: 'bright', label: 'Bright Osei' },
 *   ]}
 *   onValueChange={({ value }) => setAssignee(value[0])}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Combobox (node `38:26`) and Combobox
 * / Open (node `38:27`).
 * Built on [Ark UI Combobox](https://ark-ui.com/docs/components/combobox).
 */
export function Combobox({
  label,
  items,
  className,
  positioning = { gutter: COMBOBOX_GUTTER },
  // The open frame draws the first hit already highlighted mid-query,
  // and the component description says so in as many words. That is
  // this behaviour, not Ark's default of "none".
  inputBehavior = 'autohighlight',
  inputValue,
  defaultInputValue,
  onInputValueChange,
  ...props
}: ComboboxProps) {
  // The query mirrors what the input holds, so it has to follow the
  // same controlled/uncontrolled split Ark gives the input itself.
  const [typedValue, setTypedValue] = useState(defaultInputValue ?? '')
  const query = inputValue ?? typedValue
  const { contains } = useFilter(FILTER_OPTIONS)

  const collection = useMemo(
    () =>
      createListCollection({
        items: query === '' ? items : items.filter((item) => contains(item.label, query)),
      }),
    [items, query, contains],
  )

  const handleInputValueChange = (details: ComboboxInputValueChangeDetails) => {
    // Choosing a row — or clicking away, which reverts to the chosen
    // row — puts a label in the input rather than a query. Filtering on
    // it would leave the list showing only what is already selected.
    const isQuery = details.reason !== 'item-select' && details.reason !== 'interact-outside'
    setTypedValue(isQuery ? details.inputValue : '')
    onInputValueChange?.(details)
  }

  return (
    <ArkCombobox.Root
      {...props}
      collection={collection}
      positioning={positioning}
      inputBehavior={inputBehavior}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputValueChange={handleInputValueChange}
      className={className ? `sb-combobox ${className}` : 'sb-combobox'}
    >
      <ArkCombobox.Label className="sb-combobox__label">{label}</ArkCombobox.Label>
      <ArkCombobox.Control className="sb-combobox__control">
        {/* Decorative: the input beside it carries the accessible name. */}
        <span className="sb-combobox__search">
          <SearchIcon />
        </span>
        <ArkCombobox.Input className="sb-combobox__input" />
        {/* Ark names this one "Toggle suggestions" — override through
            the root's `translations` prop. */}
        <ArkCombobox.Trigger className="sb-combobox__trigger">
          <ChevronDownIcon />
        </ArkCombobox.Trigger>
      </ArkCombobox.Control>
      <ArkCombobox.Positioner>
        <ArkCombobox.Content className="sb-listbox sb-combobox__content">
          <ArkCombobox.ItemGroup className="sb-combobox__group">
            {collection.items.map((item) => (
              <ArkCombobox.Item key={item.value} item={item} className="sb-listbox__option">
                <ArkCombobox.ItemText className="sb-listbox__label">
                  {item.label}
                </ArkCombobox.ItemText>
                <ArkCombobox.ItemIndicator className="sb-listbox__check">
                  <CheckIcon />
                </ArkCombobox.ItemIndicator>
              </ArkCombobox.Item>
            ))}
          </ArkCombobox.ItemGroup>
        </ArkCombobox.Content>
      </ArkCombobox.Positioner>
    </ArkCombobox.Root>
  )
}
