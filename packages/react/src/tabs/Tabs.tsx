import type { ReactNode } from 'react'
import {
  Tabs as ArkTabs,
  type TabsRootProps,
  type TabListProps as ArkTabListProps,
  type TabTriggerProps as ArkTabTriggerProps,
  type TabContentProps as ArkTabContentProps,
} from '@ark-ui/react/tabs'
import './Tabs.css'

export type TabsProps = TabsRootProps
export type TabListProps = ArkTabListProps
export type TabPanelProps = ArkTabContentProps

export type TabProps = Omit<ArkTabTriggerProps, 'children'> & {
  /**
   * Figma's `Label` property. Required — the trigger is a button, and a
   * button with no label has no name.
   */
  children: ReactNode
}

/**
 * Parallel views, one visible. The tab list sits over a 3px rule with a
 * content slot below it.
 *
 * Figma draws the list and the panel as frames rather than components,
 * but Ark needs both as elements, so both are surfaced here:
 * {@link TabList} is the strip, {@link TabPanel} is the slot.
 *
 * The Figma component draws no states of its own; every visible state
 * belongs to the {@link Tab} triggers inside it.
 *
 * Ark's `Indicator` is deliberately not rendered. It is a sliding block
 * that marks the selection, and this design marks it by inverting the
 * tab itself — the description is explicit that there is no underline.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="specs">Specs</Tab>
 *     <Tab value="reviews">Reviews</Tab>
 *   </TabList>
 *   <TabPanel value="overview">Panel content.</TabPanel>
 *   <TabPanel value="specs">Panel content.</TabPanel>
 *   <TabPanel value="reviews">Panel content.</TabPanel>
 * </Tabs>
 * ```
 *
 * Figma: Steelbook Design System › Tabs (node `30:212`).
 * Built on [Ark UI Tabs](https://ark-ui.com/docs/components/tabs).
 */
export function Tabs({ className, ...props }: TabsProps) {
  return (
    <ArkTabs.Root {...props} className={className ? `sb-tabs ${className}` : 'sb-tabs'} />
  )
}

/**
 * The strip of triggers, and the 3px rule under them.
 *
 * The rule is painted over the last 3px of the tabs rather than added
 * below them, because that is what Figma's inside stroke does: the strip
 * measures 40px tall, not 43, and a hovered tab's grey fill stops at the
 * rule instead of covering it.
 *
 * Tabs do not shrink, and the strip clips. Figma draws it that way, and
 * the design says nothing about what should happen when there are more
 * tabs than room — so nothing was invented. If a list can overflow, give
 * it somewhere to scroll.
 */
export function TabList({ className, ...props }: TabListProps) {
  return (
    <ArkTabs.List
      {...props}
      className={className ? `sb-tabs__list ${className}` : 'sb-tabs__list'}
    />
  )
}

/**
 * One tab trigger: a 40px block with 16px insets and a `label/md` label,
 * inverting to a solid black block when selected. No underline hedging.
 *
 * The Figma `Selected` axis is the tabs' `value`, never a prop on the
 * trigger, and `Interaction` is a skin: Hover is `:hover`, Disabled is
 * the prop, which Ark forwards to the button.
 *
 * Selected outranks both. All three Selected=True variants are drawn
 * identically — a selected tab does not lighten on hover and does not
 * grey out when disabled — so the selected skin is written last and
 * wins on source order.
 *
 * Figma draws no Focus state. The trigger is a button, so it takes the
 * house ring, inset — the tabs are flush with each other and with the
 * rule, and an outside ring would sit on both.
 *
 * Figma: Steelbook Design System › Tab (node `30:200`).
 */
export function Tab({ className, ...props }: TabProps) {
  return (
    <ArkTabs.Trigger {...props} className={className ? `sb-tab ${className}` : 'sb-tab'} />
  )
}

/**
 * The content slot under the rule — `bg/surface` with 24px insets.
 *
 * Figma's frame holds one line of `body/md`; the panel carries that type
 * so plain text lands as drawn, and anything richer can override it.
 * The description is explicit that the frame is a slot: swap it for
 * whatever the view needs.
 */
export function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <ArkTabs.Content
      {...props}
      className={className ? `sb-tabs__panel ${className}` : 'sb-tabs__panel'}
    />
  )
}
