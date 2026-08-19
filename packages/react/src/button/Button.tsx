import type { ComponentPropsWithRef, ReactNode } from 'react'
import './Button.css'

/** Control height: sm 32 / md 40 / lg 48. */
export type ButtonSize = 'sm' | 'md' | 'lg'

/** Visual weight of the action, from loudest (`primary`) to quietest (`ghost`). */
export type ButtonTone = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  /**
   * The label. Required: the Figma component has no icon-only variant, and a
   * button with no text reaches the accessibility tree unnamed.
   */
  children: ReactNode
  /** @default 'sm' — the default variant of the Figma component set. */
  size?: ButtonSize
  /** @default 'primary' */
  tone?: ButtonTone
  /**
   * Glyph rendered in the slot before the label. Mirrors the `icon-left`
   * instance-swap slot on the Figma component, whose default instance is
   * {@link ArrowLeftIcon}. Decorative — the slot is `aria-hidden`, so the
   * label must carry the whole meaning.
   */
  iconLeft?: ReactNode
  /** As `iconLeft`, after the label. Figma slot `icon-right`. */
  iconRight?: ReactNode
}

/**
 * The primary action control.
 *
 * Figma's `State` axis (Default / Hover / Active / Focus / Disabled) is an
 * interaction skin, not an API: it is expressed in CSS as `:hover`,
 * `:active`, `:focus-visible` and `:disabled`. Pass `disabled` to reach the
 * disabled skin; the other four are driven by the user, never by a prop.
 *
 * Renders a native `<button>` — Ark UI has no Button primitive, and the
 * Figma component's notes call for the element directly. `type` defaults to
 * `"button"` so a button inside a form does not submit it by accident.
 *
 * @example
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * <Button tone="danger" size="lg" onClick={remove}>Delete project</Button>
 * <Button tone="ghost" iconLeft={<ArrowLeftIcon />}>Back</Button>
 * ```
 *
 * Figma: Steelbook Design System › Button (node `14:2`).
 */
export function Button({
  children,
  size = 'sm',
  tone = 'primary',
  iconLeft,
  iconRight,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['sb-button', `sb-button--${size}`, `sb-button--${tone}`]
  if (className) classes.push(className)

  return (
    <button {...props} type={type} className={classes.join(' ')}>
      {iconLeft ? (
        <span className="sb-button__icon" aria-hidden="true">
          {iconLeft}
        </span>
      ) : null}
      <span className="sb-button__label">{children}</span>
      {iconRight ? (
        <span className="sb-button__icon" aria-hidden="true">
          {iconRight}
        </span>
      ) : null}
    </button>
  )
}
