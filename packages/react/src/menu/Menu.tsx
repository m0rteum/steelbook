import type { ReactElement, ReactNode } from 'react'
import {
  Menu as ArkMenu,
  type MenuRootProps,
  type MenuItemProps as ArkMenuItemProps,
  type MenuSeparatorProps as ArkMenuSeparatorProps,
} from '@ark-ui/react/menu'
import './Menu.css'

export type MenuProps = Omit<MenuRootProps, 'children'> & {
  /**
   * The control that opens the menu. Rendered *as* Ark's trigger via
   * `asChild`, so it must be a single element that takes a ref.
   */
  trigger: ReactElement
  /** {@link MenuItem}s and {@link MenuSeparator}s, in the drawn order. */
  children: ReactNode
  /** Appended after the menu's own class, on the drawn box. */
  className?: string
}

/** Figma's `Type` axis, less Disabled — that one is the `disabled` prop. */
export type MenuItemTone = 'default' | 'danger'

export type MenuItemProps = Omit<ArkMenuItemProps, 'children'> & {
  /** Figma text property `Label`. */
  children: ReactNode
  /**
   * Figma instance-swap slot `Icon`, whose default instance is
   * {@link PenIcon}. Decorative — the slot is `aria-hidden`, so the label
   * must carry the whole meaning. Omitting it is Figma's `Show icon=false`.
   */
  icon?: ReactNode
  /**
   * Figma text property `Shortcut` — the mono keystroke on the right.
   * Omitting it is `Show shortcut=false`.
   */
  shortcut?: ReactNode
  /** @default 'default' — the default variant of the Figma component set. */
  tone?: MenuItemTone
}

export type MenuSeparatorProps = Omit<ArkMenuSeparatorProps, 'children'>

/**
 * A floating command list on a raised surface with the md hard shadow.
 * Ark drives opening, keyboard navigation, typeahead, focus and the
 * ARIA; the visual design stays as drawn.
 *
 * Two decisions the design did not make:
 *
 * - **No trigger is drawn.** The frame is only the panel, so the trigger
 *   is whatever the caller passes as `trigger`, spread onto their own
 *   element with `asChild` rather than wrapped in Ark's default
 *   `<button>` — which would nest a button inside a button.
 * - **No placement is drawn.** Ark's default (below the trigger) stands;
 *   pass `positioning` to change it.
 *
 * The panel is fixed at the drawn 240px. Figma hugs it around items that
 * are themselves fixed at 240, which comes to the same thing, and fixing
 * it here is what lets a long label wrap and grow its row — exactly what
 * the frame does, since the label fills the row and auto-sizes in height.
 *
 * Not portalled: the Positioner is placed where the menu is written, so
 * an `overflow: hidden` ancestor will clip it. Wrap it in Ark's
 * `<Portal>` where that matters.
 *
 * @example
 * ```tsx
 * <Menu trigger={<Button>Actions</Button>} onSelect={({ value }) => run(value)}>
 *   <MenuItem value="rename" icon={<PenIcon />} shortcut="⌘R">Rename</MenuItem>
 *   <MenuItem value="duplicate" icon={<CopyIcon />} shortcut="⌘D">Duplicate</MenuItem>
 *   <MenuSeparator />
 *   <MenuItem value="delete" tone="danger" icon={<TrashIcon />} shortcut="⌫">Delete</MenuItem>
 * </Menu>
 * ```
 *
 * Figma: Steelbook Design System › Menu (node `35:28`).
 * Built on [Ark UI Menu](https://ark-ui.com/docs/components/menu).
 */
export function Menu({ trigger, children, className, ...props }: MenuProps) {
  return (
    <ArkMenu.Root {...props}>
      <ArkMenu.Trigger asChild>{trigger}</ArkMenu.Trigger>
      <ArkMenu.Positioner>
        <ArkMenu.Content className={className ? `sb-menu ${className}` : 'sb-menu'}>
          {children}
        </ArkMenu.Content>
      </ArkMenu.Positioner>
    </ArkMenu.Root>
  )
}

/**
 * One row of the list: icon, label, mono shortcut. Danger reddens the
 * icon and the label; the shortcut stays muted throughout.
 *
 * Figma's `Type` axis carries three values, but only two of them are a
 * kind of item. Disabled is a state, so it arrives as Ark's `disabled`
 * prop — the same route Button's disabled skin takes — and `tone` is left
 * holding Default and Danger. `Interaction=Hover` is CSS: Ark sets
 * `data-highlighted` on the row under the pointer *and* on the row the
 * keyboard is on, so one selector paints both.
 *
 * The icon and the shortcut are drawn behind `Show icon` / `Show
 * shortcut` booleans in Figma; here they are simply the presence of
 * `icon` and `shortcut`.
 *
 * Ark's typeahead matches on the row's text, which starts with the
 * label, so the shortcut riding at the end of it costs nothing. Pass
 * `valueText` to override what typeahead sees.
 *
 * Figma: Steelbook Design System › Menu Item (node `35:27`).
 */
export function MenuItem({
  children,
  icon,
  shortcut,
  tone = 'default',
  className,
  ...props
}: MenuItemProps) {
  const classes = ['sb-menu-item', `sb-menu-item--${tone}`]
  if (className) classes.push(className)

  return (
    <ArkMenu.Item {...props} className={classes.join(' ')}>
      {icon != null ? (
        <span className="sb-menu-item__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="sb-menu-item__label">{children}</span>
      {shortcut != null ? <span className="sb-menu-item__shortcut">{shortcut}</span> : null}
    </ArkMenu.Item>
  )
}

/**
 * The 2px muted rule between groups of rows. Figma draws it as a plain
 * frame inside the Menu rather than a component of its own; Ark gives it
 * `role="separator"`.
 *
 * Figma: Steelbook Design System › Menu (node `35:47`).
 */
export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <ArkMenu.Separator
      {...props}
      className={className ? `sb-menu__separator ${className}` : 'sb-menu__separator'}
    />
  )
}
