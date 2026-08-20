import type { ComponentType, ReactNode, SVGProps } from 'react'
import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  createToaster as arkCreateToaster,
  type ToasterProps as ArkToasterProps,
  type CreateToasterProps,
  type CreateToasterReturn,
  type ToastOptions,
} from '@ark-ui/react/toast'
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon'
import { CheckCircleIcon } from '../icons/CheckCircleIcon'
import { InfoIcon } from '../icons/InfoIcon'
import { XIcon } from '../icons/XIcon'
import './Toast.css'

export type { CreateToasterProps, CreateToasterReturn, ToastOptions }

/** Figma's `Tone` axis, in the design's own words. */
export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info'

/**
 * Figma's `Tone` axis is Ark's `type`, and the two vocabularies differ:
 * what the design calls Danger, the machine calls `error`, and the
 * machine has no name at all for Neutral. Pass a value from here as the
 * `type` and the slab renders the tone you asked for.
 *
 * ```tsx
 * toaster.create({ type: TOAST_TONES.danger, title: 'Upload failed' })
 * ```
 */
export const TOAST_TONES = {
  neutral: 'neutral',
  success: 'success',
  danger: 'error',
  warning: 'warning',
  info: 'info',
} as const satisfies Record<ToastTone, string>

/**
 * Neutral is not in this map — it is the base skin, so `neutral` and
 * anything else the design does not draw (`loading` included) fall
 * through to the info glyph on the accent color, which is what Figma
 * draws for it.
 */
const TONE_GLYPHS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  success: CheckCircleIcon,
  error: AlertTriangleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
}

/** The five types the machine knows how to rank in its queue. */
const RANKED_TYPES = new Set(['error', 'warning', 'loading', 'success', 'info'])

/** The bottom rung of the machine's 1–8 queue. */
const UNRANKED_PRIORITY = 8 as const

/**
 * `createToaster`, with one thing added: a queue priority for tones the
 * machine has never heard of.
 *
 * Zag ranks a new toast by looking its `type` up in a fixed table and
 * destructuring the result. A type outside that table — `'neutral'`,
 * which is the only way to reach the tone Figma draws by default —
 * throws on `create` unless a `priority` comes with it. Rather than make
 * every call site remember that, unranked tones land on the bottom rung,
 * below Info. Pass your own `priority` and it is left alone.
 *
 * Everything else is Ark's: placement, max, overlap, duration, gap,
 * offsets, hotkey.
 */
export function createToaster<T = ReactNode>(props: CreateToasterProps): CreateToasterReturn<T> {
  const store = arkCreateToaster<T>(props)
  const create: CreateToasterReturn<T>['create'] = (options) =>
    store.create(
      options.type !== undefined &&
        !RANKED_TYPES.has(options.type) &&
        options.priority === undefined
        ? { ...options, priority: UNRANKED_PRIORITY }
        : options,
    )
  return { ...store, create }
}

export type ToasterProps = Omit<ArkToasterProps, 'children'>

/**
 * Transient news. Neutral is a black slab; status tones ride their subtle
 * fills behind the same black border and md hard shadow.
 *
 * This renders the whole region, not one toast: Ark's `Toast.Root` reads
 * the toast off a context the region supplies, so a single slab cannot
 * stand alone. Mount one `Toaster` near the root of the app and push to
 * it from anywhere with the store you handed it.
 *
 * Three things worth knowing:
 *
 * - **Tone is the toast's `type`, and the two vocabularies disagree.**
 *   `success`, `warning` and `info` map straight across; Figma's Danger
 *   is Ark's `error`; Neutral has no name in the machine at all, so it
 *   is spelled `'neutral'` here. `TOAST_TONES` holds the mapping.
 *   **An omitted `type` is `info`, not Neutral** — that is the store's
 *   default, and it is the one place code and Figma disagree on what
 *   "default" means. Name the tone and the question does not arise.
 * - **`Show body` is the presence of a `description`.** Omit it and the
 *   slab is a single line; the frame hugs its content either way.
 * - **Placement, stack gap and duration are not drawn.** They belong to
 *   the store you build with `createToaster`, so they stay the caller's.
 *
 * @example
 * ```tsx
 * const toaster = createToaster({ placement: 'bottom-end', gap: 12 })
 *
 * // once, near the root
 * <Toaster toaster={toaster} />
 *
 * // anywhere
 * toaster.create({
 *   type: 'neutral',
 *   title: 'Draft saved',
 *   description: 'Your work is safe on this device.',
 * })
 * toaster.create({ type: TOAST_TONES.danger, title: 'Upload failed' })
 * ```
 *
 * Figma: Steelbook Design System › Toast (node `42:42`).
 * Built on [Ark UI Toast](https://ark-ui.com/docs/components/toast).
 */
export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <ArkToaster {...props} className={className ? `sb-toaster ${className}` : 'sb-toaster'}>
      {(toast) => {
        const Glyph = (toast.type && TONE_GLYPHS[toast.type]) || InfoIcon
        return (
          <ArkToast.Root className="sb-toast">
            <span className="sb-toast__glyph" aria-hidden="true">
              <Glyph />
            </span>
            <div className="sb-toast__text">
              <ArkToast.Title className="sb-toast__title">{toast.title}</ArkToast.Title>
              {toast.description ? (
                <ArkToast.Description className="sb-toast__body">
                  {toast.description}
                </ArkToast.Description>
              ) : null}
            </div>
            {/* Ark names this one from its own translations ("Dismiss notification"). */}
            <ArkToast.CloseTrigger className="sb-toast__dismiss">
              <XIcon />
            </ArkToast.CloseTrigger>
          </ArkToast.Root>
        )
      }}
    </ArkToaster>
  )
}
