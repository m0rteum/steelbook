import type { ComponentPropsWithRef, ReactNode } from 'react'
import { XIcon } from '../icons/XIcon'
import './Tag.css'

export type TagTone = 'solid' | 'outline'

/**
 * Figma's `Removable` boolean is the presence of a handler: give the tag
 * an `onRemove` and it draws its ×, leave it off and it does not. The ×
 * is icon-only, so a name for it is required in the same breath — the
 * two travel together or not at all.
 */
type TagRemoveProps =
  | { onRemove: () => void; removeLabel: string }
  | { onRemove?: never; removeLabel?: never }

export type TagProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Figma's `Tone` axis. Solid for committed values, outline for suggestions. */
  tone?: TagTone
  /** Figma's `Label` property. */
  children: ReactNode
} & TagRemoveProps

/**
 * A removable token. Solid for committed values, outline for suggestions.
 *
 * There is no Ark primitive behind this one — the description names
 * none, and a chip has no behaviour to delegate. It is a plain element
 * with a button in it.
 *
 * Inside a Tags Input the chip's text and × belong to Ark, which owns
 * their ids, ARIA and handlers, so that component cannot mount this one;
 * it wears `Tag.css` instead, which is where the skin is defined once.
 *
 * @example
 * ```tsx
 * <Tag tone="outline" onRemove={() => drop('steel')} removeLabel="Remove steel">
 *   steel
 * </Tag>
 * ```
 *
 * Figma: Steelbook Design System › Tag (node `30:10`).
 */
export function Tag({
  tone = 'solid',
  children,
  onRemove,
  removeLabel,
  className,
  ...props
}: TagProps) {
  const classes = ['sb-tag', `sb-tag--${tone}`, className].filter(Boolean).join(' ')
  return (
    <span {...props} className={classes}>
      <span className="sb-tag__label">{children}</span>
      {onRemove ? (
        <button
          type="button"
          className="sb-tag__remove"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <XIcon />
        </button>
      ) : null}
    </span>
  )
}
