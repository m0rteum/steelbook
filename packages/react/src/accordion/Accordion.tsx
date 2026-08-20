import type { ReactNode } from 'react'
import {
  Accordion as ArkAccordion,
  type AccordionRootProps,
  type AccordionItemProps as ArkAccordionItemProps,
} from '@ark-ui/react/accordion'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { ChevronUpIcon } from '../icons/ChevronUpIcon'
import './Accordion.css'

export type AccordionProps = AccordionRootProps

export type AccordionItemProps = Omit<ArkAccordionItemProps, 'children' | 'title'> & {
  /**
   * Figma's `Title` property — the question on the trigger row. Required:
   * the row is a button, and a button with no label has no name.
   *
   * This shadows the native `title` attribute, which would otherwise put
   * a browser tooltip on the item. An accordion row does not want one.
   */
  title: ReactNode
  /** Figma's `Body` property — the answer, revealed when the row opens. */
  children: ReactNode
}

/**
 * Stacked disclosure panels under 3px rules, one open at a time.
 *
 * The Figma component draws no states of its own; every visible state
 * belongs to the {@link AccordionItem} rows inside it.
 *
 * Two of Ark's defaults are kept because the design is silent on both,
 * and both are worth knowing: `multiple` is off, so opening a row closes
 * the last one, and `collapsible` is off, so the open row cannot be
 * clicked shut — some row is always open. Turn either on if the content
 * calls for it.
 *
 * For a single reveal with no siblings, this is the wrong primitive.
 *
 * @example
 * ```tsx
 * <Accordion defaultValue={['made-of']}>
 *   <AccordionItem value="made-of" title="What is Steelbook made of?">
 *     Two colors, one accent, a 4px grid and an unreasonable amount of conviction.
 *   </AccordionItem>
 *   <AccordionItem value="dark-mode" title="Does it support dark mode?">
 *     Every token is bound — flip the mode and it holds.
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * Figma: Steelbook Design System › Accordion (node `31:25`).
 * Built on [Ark UI Accordion](https://ark-ui.com/docs/components/accordion).
 */
export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <ArkAccordion.Root
      {...props}
      className={className ? `sb-accordion ${className}` : 'sb-accordion'}
    />
  )
}

/**
 * One question per 3px rule, with the answer folded under it. The
 * chevron flips when the row opens.
 *
 * The Figma `Expanded` axis is the accordion's `value`, never a prop on
 * the row, and `Interaction` is a skin: Hover is `:hover`, Disabled is
 * the prop, which Ark forwards to the trigger button.
 *
 * Hover is painted on the trigger rather than on the row. Figma fills
 * the whole row, but only draws Hover while the row is closed — where
 * the trigger *is* the row, to the pixel. Painting the trigger keeps the
 * open row's answer text off a grey field, which the design never draws.
 *
 * Two chevrons ship in the indicator and CSS shows one, so the flip
 * needs no React state and both glyphs stay the ones Figma exported.
 *
 * Figma draws no Focus state. The trigger is a button, so it takes the
 * house ring, inset — an outside ring would sit on the rule above it.
 *
 * Figma: Steelbook Design System › Accordion Item (node `31:24`).
 */
export function AccordionItem({ title, children, className, ...props }: AccordionItemProps) {
  return (
    <ArkAccordion.Item
      {...props}
      className={className ? `sb-accordion-item ${className}` : 'sb-accordion-item'}
    >
      <ArkAccordion.ItemTrigger className="sb-accordion-item__trigger">
        <span className="sb-accordion-item__title">{title}</span>
        <ArkAccordion.ItemIndicator className="sb-accordion-item__indicator">
          <ChevronDownIcon className="sb-accordion-item__chevron--closed" />
          <ChevronUpIcon className="sb-accordion-item__chevron--open" />
        </ArkAccordion.ItemIndicator>
      </ArkAccordion.ItemTrigger>
      <ArkAccordion.ItemContent className="sb-accordion-item__content">
        {children}
      </ArkAccordion.ItemContent>
    </ArkAccordion.Item>
  )
}
