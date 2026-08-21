import { useMemo } from 'react'
import {
  Listbox as ArkListbox,
  createListCollection,
  type ListboxRootProps,
} from '@ark-ui/react/listbox'
import { CheckIcon } from '../icons/CheckIcon'
import './Listbox.css'

/**
 * One row of the list. `label` is the Figma `Label` text property;
 * `disabled` is its `Interaction=Disabled` variant, which is a state
 * rather than a kind of row. `value` is what selection reports.
 *
 * The keys are the ones Ark's collection reads by default, so nothing
 * has to be mapped.
 */
export type ListboxItem = {
  value: string
  label: string
  disabled?: boolean
}

/**
 * The list draws no label of its own, so it cannot name itself. One of
 * these is required, and they are mutually exclusive — the same rule the
 * system applies to icon-only controls.
 */
type ListboxAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }

export type ListboxProps = Omit<
  ListboxRootProps<ListboxItem>,
  'children' | 'collection' | 'aria-label' | 'aria-labelledby'
> & {
  /** The rows, in order. */
  items: ListboxItem[]
  /** Appended after the list's own class, on the drawn box. */
  className?: string
} & ListboxAccessibleName

/**
 * A standalone selectable list: a bordered panel of rows, one of which
 * reads in accent ink and carries an orange check. Ark drives selection,
 * keyboard navigation, typeahead and the ARIA; the visual design stays
 * as drawn.
 *
 * Both Figma components live here. The `Selected` and `Interaction` axes
 * on Listbox Option are not choices a caller makes — Ark derives
 * selected and highlighted from the machine, and a separately mountable
 * option would still need the collection the row came from. So the list
 * takes the rows and renders them, the way Pagination renders its own
 * cells.
 *
 * Three decisions the design did not make:
 *
 * - **The list has no name.** No label is drawn, and Ark points the
 *   panel's `aria-labelledby` at a Label part unconditionally, so
 *   leaving that part out would dangle the reference. `aria-label` or
 *   `aria-labelledby` is required at the type level, and each is wired
 *   so the reference resolves: a name by reference redirects Ark's
 *   label id at the caller's element, and a literal name renders the
 *   Label part carrying it, `display: none` so nothing undrawn appears.
 *   A hidden element referenced by `aria-labelledby` still names its
 *   target, but that string also goes on as a plain `aria-label` so the
 *   name does not rest on that one detail — both routes carry the same
 *   text, so whichever the browser resolves, the name is the same.
 * - **No focus treatment is drawn.** The panel is tabbable, so it takes
 *   the house 3px ring rather than a browser default that belongs to no
 *   design. Once inside, the highlighted row is the indicator — Ark
 *   points at it with `aria-activedescendant`.
 * - **Selection is single.** Exactly one row is drawn selected and Ark's
 *   default agrees; pass `selectionMode` for anything else.
 *
 * **Selection is marked by ink, not by weight.** A selected row keeps
 * body/md and turns `text/accent`, with the check appearing beside it.
 * Nothing about the box changes, so every row measures 42 whatever is
 * selected and the list holds still as the selection moves.
 *
 * @example
 * ```tsx
 * <Listbox
 *   aria-label="Palette"
 *   items={[
 *     { value: 'gunmetal', label: 'Gunmetal' },
 *     { value: 'concrete', label: 'Concrete' },
 *   ]}
 *   defaultValue={['gunmetal']}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Listbox (node `37:17`) and Listbox
 * Option (node `37:16`).
 * Built on [Ark UI Listbox](https://ark-ui.com/docs/components/listbox).
 */
export function Listbox({
  items,
  className,
  ids,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}: ListboxProps) {
  const collection = useMemo(() => createListCollection({ items }), [items])

  return (
    <ArkListbox.Root
      {...props}
      collection={collection}
      ids={ariaLabelledby != null ? { ...ids, label: ariaLabelledby } : ids}
      className="sb-listbox-root"
    >
      {ariaLabel != null ? (
        <ArkListbox.Label className="sb-listbox__name">{ariaLabel}</ArkListbox.Label>
      ) : null}
      <ArkListbox.Content
        className={className ? `sb-listbox ${className}` : 'sb-listbox'}
        aria-label={ariaLabel}
      >
        {items.map((item) => (
          <ArkListbox.Item key={item.value} item={item} className="sb-listbox__option">
            <ArkListbox.ItemText className="sb-listbox__label">{item.label}</ArkListbox.ItemText>
            <ArkListbox.ItemIndicator className="sb-listbox__check">
              <CheckIcon />
            </ArkListbox.ItemIndicator>
          </ArkListbox.Item>
        ))}
      </ArkListbox.Content>
    </ArkListbox.Root>
  )
}
