import type { ReactNode } from 'react'
import {
  Collapsible as ArkCollapsible,
  type CollapsibleRootProps,
} from '@ark-ui/react/collapsible'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import './Collapsible.css'

export type CollapsibleProps = Omit<CollapsibleRootProps, 'children' | 'title'> & {
  /**
   * Figma's `Title` property — the label on the trigger row. Required:
   * the row is a button, and a button with no label has no name.
   *
   * This shadows the native `title` attribute, which would otherwise put
   * a browser tooltip on the root. A disclosure row does not want one.
   */
  title: ReactNode
  /** What the row reveals. Required — a disclosure with nothing behind it has nothing to do. */
  children: ReactNode
}

/**
 * A single disclosure without the accordion contract: one trigger row,
 * one panel, no rule and no siblings.
 *
 * The Figma component draws the trigger only — `Title` in label/md with a
 * 16px chevron 8px after it, 12px above and below. Everything else was
 * decided here because the file is silent on it:
 *
 * - **No content panel is drawn.** The panel ships as an unstyled slot;
 *   Ark hides it with the `hidden` attribute while closed. Type, inset
 *   and colour are the caller's until the design draws them.
 * - **No Open state is drawn**, so the chevron does not flip. Accordion
 *   Item swaps chevron-down for chevron-up when it opens; this file draws
 *   one glyph, so one ships. Ark marks the indicator `data-state`, so a
 *   flip is one rule away once the design says which glyph.
 * - **No Hover, Focus or Disabled is drawn.** Hover gets nothing. Focus
 *   takes the house 3px ring, inset. `disabled` takes the house inks —
 *   text/disabled and icon/disabled with `cursor: not-allowed` — the way
 *   Accordion Item does; the row has no fill or border to grey.
 * - **The 480px width is the frame's**, not the component's. Fluid.
 * - The 8px gap and 12px block inset are not bound in the file but sit
 *   exactly on gap/xs and gap/sm, so they are carried as those tokens.
 *
 * `open` / `defaultOpen` / `onOpenChange`, `disabled`, `lazyMount` and
 * `unmountOnExit` pass through to Ark's Root. A `state` prop is refused
 * at the type level.
 *
 * @example
 * ```tsx
 * <Collapsible title="Show advanced options">
 *   <AdvancedOptions />
 * </Collapsible>
 * ```
 *
 * Figma: Steelbook Design System › Collapsible (node `31:43`).
 * Built on [Ark UI Collapsible](https://ark-ui.com/docs/components/collapsible).
 */
export function Collapsible({ title, children, className, ...props }: CollapsibleProps) {
  return (
    <ArkCollapsible.Root
      {...props}
      className={className ? `sb-collapsible ${className}` : 'sb-collapsible'}
    >
      <ArkCollapsible.Trigger className="sb-collapsible__trigger">
        <span className="sb-collapsible__title">{title}</span>
        <ArkCollapsible.Indicator className="sb-collapsible__indicator">
          <ChevronDownIcon />
        </ArkCollapsible.Indicator>
      </ArkCollapsible.Trigger>
      <ArkCollapsible.Content className="sb-collapsible__content">{children}</ArkCollapsible.Content>
    </ArkCollapsible.Root>
  )
}
