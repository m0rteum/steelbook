/**
 * Compile-time conformance test: `Tone` is a prop because it is a drawn
 * variant, but nothing else is — the units are fixed by the design and
 * the running state belongs to Ark.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TimerProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Timer } from './Timer'

// Accepted — the drawn default: a countdown that starts on mount.
export const basic = <Timer startMs={52_329_000} />

// Accepted — Tone=Urgent.
export const urgent = <Timer startMs={9_000} tone="urgent" />

// Accepted — Ark's own switches pass straight through.
export const counter = (
  <Timer
    countdown={false}
    autoStart={false}
    targetMs={60_000}
    interval={100}
    onTick={({ time }) => void time}
    onComplete={() => {}}
  />
)

// @ts-expect-error — Tone is default or urgent; there is no third variant.
export const unknownTone = <Timer startMs={1_000} tone="danger" />

// @ts-expect-error — running and paused are Ark's state, not props.
export const runningAsProp = <Timer startMs={1_000} running />

// @ts-expect-error — the units are fixed by the design; children are not composed here.
export const withChildren = <Timer startMs={1_000}>extra</Timer>
