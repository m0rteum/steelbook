import type { ReactNode } from 'react'
import { TagsInput as ArkTagsInput, type TagsInputRootProps } from '@ark-ui/react/tags-input'
import { XIcon } from '../icons/XIcon'
import '../tag/Tag.css'
import './TagsInput.css'

export type TagsInputProps = Omit<TagsInputRootProps, 'children'> & {
  /**
   * The label above the control. Required — every variant of the Figma
   * component draws it, and it is what names the input.
   */
  label: ReactNode
}

/**
 * Free-text tokens that wrap. Backspace pops the last tag; each chip
 * removes with its ×. Ark drives the keyboard, the paste splitting, tag
 * editing and the ARIA; the visual design stays as drawn.
 *
 * The Figma `State` axis maps the usual way, except that Focus is Ark's
 * own `data-focus` on the control rather than `:focus-within` — the
 * machine already tracks whether the field owns focus, and it keeps the
 * ring steady while focus moves between the input and a highlighted tag.
 * There is no `state` prop.
 *
 * **The chips are Tag's skin, not Tag's markup.** Ark owns each chip's
 * text and delete trigger — their ids, their `aria-label` (from
 * `translations.deleteTagTriggerLabel`), the pointer handlers and the
 * hover intent — so those have to be Ark's own elements. Mounting the
 * `Tag` component here would mean re-implementing all of that inside it.
 * Instead the Ark parts wear `sb-tag`, `sb-tag__label` and
 * `sb-tag__remove`, so the chip has exactly one visual definition, in
 * `Tag.css`. Change the chip there and both components move together.
 *
 * Two departures from the frame, both flagged in Figma:
 *
 * - **The control fills its container.** Figma hugs it, which is why the
 *   Focus frame is drawn narrower than the Default one — but a field
 *   that changes width on every keystroke and every tag is a defect, not
 *   a design, and every other Steelbook field is fluid.
 * - **No highlighted chip is drawn.** Ark marks the tag that Backspace
 *   has selected with `data-highlighted`, and nothing in the design says
 *   what that should look like, so it currently looks like any other.
 *
 * Nor is an editing state drawn, though Ark turns a chip into an input on
 * Enter or a double-click. Rather than invent a skin, the editor wears
 * the outline tone — the drawn look for a value not yet committed.
 *
 * @example
 * ```tsx
 * <TagsInput
 *   label="Materials"
 *   defaultValue={['gunmetal', 'concrete']}
 *   placeholder="Add material…"
 * />
 * ```
 *
 * Figma: Steelbook Design System › Tags Input (node `30:43`).
 * Built on [Ark UI TagsInput](https://ark-ui.com/docs/components/tags-input).
 */
export function TagsInput({ label, className, placeholder, ...props }: TagsInputProps) {
  return (
    <ArkTagsInput.Root
      {...props}
      placeholder={placeholder}
      className={className ? `sb-tags-input ${className}` : 'sb-tags-input'}
    >
      <ArkTagsInput.Label className="sb-tags-input__label">{label}</ArkTagsInput.Label>
      <ArkTagsInput.Control className="sb-tags-input__control">
        <ArkTagsInput.Context>
          {(api) =>
            api.value.map((value, index) => (
              <ArkTagsInput.Item
                key={`${value}-${index}`}
                index={index}
                value={value}
                className="sb-tags-input__item"
              >
                <ArkTagsInput.ItemPreview className="sb-tag sb-tag--solid">
                  <ArkTagsInput.ItemText className="sb-tag__label">{value}</ArkTagsInput.ItemText>
                  <ArkTagsInput.ItemDeleteTrigger className="sb-tag__remove">
                    <XIcon />
                  </ArkTagsInput.ItemDeleteTrigger>
                </ArkTagsInput.ItemPreview>
                <ArkTagsInput.ItemInput className="sb-tag sb-tag--outline sb-tags-input__item-input" />
              </ArkTagsInput.Item>
            ))
          }
        </ArkTagsInput.Context>
        {/* Ark drops the placeholder as soon as a tag exists; the design
            draws it alongside three, so it is set here to override that. */}
        <ArkTagsInput.Input className="sb-tags-input__input" placeholder={placeholder} />
      </ArkTagsInput.Control>
      <ArkTagsInput.HiddenInput />
    </ArkTagsInput.Root>
  )
}
