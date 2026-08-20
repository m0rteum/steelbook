import { Fragment } from 'react'
import { Timer as ArkTimer, type TimerRootProps } from '@ark-ui/react/timer'
import './Timer.css'

export type TimerTone = 'default' | 'urgent'

export type TimerProps = Omit<TimerRootProps, 'children'> & {
  /**
   * Figma's `Tone` axis. Urgent floods the blocks orange; it is a prop
   * rather than a threshold because the design says when it looks
   * urgent, not when it becomes urgent. Flip it from `onTick`.
   */
  tone?: TimerTone
}

/** The four units the design draws, in order, with their drawn labels. */
const UNITS = [
  { type: 'days', label: 'DAYS' },
  { type: 'hours', label: 'HRS' },
  { type: 'minutes', label: 'MIN' },
  { type: 'seconds', label: 'SEC' },
] as const

/**
 * Countdown in machined blocks: four 64 × 56 cells, each over its own
 * mono caption, separated by colons.
 *
 * `countdown` and `autoStart` both default to `true`, unlike the Ark
 * primitive. The description calls this a countdown, and the design
 * draws no controls — no `Control` or `ActionTrigger` part is rendered —
 * so a timer that neither counted down nor started would sit frozen at
 * whatever `startMs` says. Pass either as `false` to opt out and drive
 * it yourself.
 *
 * Ark's `Item` renders the formatted value itself, so the digit block is
 * the Item rather than a wrapper around one. `Separator` renders no
 * content of its own, so the colon is passed in. The unit captions are
 * plain elements: the machine exposes label props but Ark ships no
 * `ItemLabel` component to hang them on.
 *
 * The parts are fixed by the design — days, hours, minutes, seconds, in
 * that order. Milliseconds exist in the machine but are not drawn.
 *
 * @example
 * ```tsx
 * <Timer startMs={52_329_000} onComplete={() => launch()} />
 * ```
 *
 * Figma: Steelbook Design System › Timer (node `40:508`).
 * Built on [Ark UI Timer](https://ark-ui.com/docs/components/timer).
 */
export function Timer({
  tone = 'default',
  countdown = true,
  autoStart = true,
  className,
  ...props
}: TimerProps) {
  const classes = ['sb-timer', `sb-timer--${tone}`, className].filter(Boolean).join(' ')
  return (
    <ArkTimer.Root {...props} countdown={countdown} autoStart={autoStart} className={classes}>
      <ArkTimer.Area className="sb-timer__area">
        {UNITS.map((unit, index) => (
          <Fragment key={unit.type}>
            {index > 0 ? (
              <ArkTimer.Separator className="sb-timer__separator">:</ArkTimer.Separator>
            ) : null}
            <div className="sb-timer__unit">
              <ArkTimer.Item type={unit.type} className="sb-timer__digits" />
              <span className="sb-timer__label">{unit.label}</span>
            </div>
          </Fragment>
        ))}
      </ArkTimer.Area>
    </ArkTimer.Root>
  )
}
