/**
 * Compile-time conformance test: a Floating Panel always carries a
 * title — it is the dialog's accessible name — and the parts the design
 * fixes are not composed by the consumer.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening FloatingPanelProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { FloatingPanel } from './FloatingPanel'

// Accepted — the drawn default: open, 320 × 260.
export const basic = <FloatingPanel title="INSPECTOR">Slot.</FloatingPanel>

// Accepted — open state and placement are Ark's, reachable through its own props.
export const controlled = (
  <FloatingPanel
    title="INSPECTOR"
    open
    onOpenChange={({ open }) => void open}
    defaultPosition={{ x: 40, y: 40 }}
    defaultSize={{ width: 400, height: 300 }}
  >
    Slot.
  </FloatingPanel>
)

// Accepted — dragging and resizing can be turned off, as Ark allows.
export const pinned = (
  <FloatingPanel title="INSPECTOR" draggable={false} resizable={false}>
    Slot.
  </FloatingPanel>
)

// @ts-expect-error — the panel is named by its title, which is required.
export const untitled = <FloatingPanel>Slot.</FloatingPanel>

// @ts-expect-error — Focus is a skin and minimized is Ark's stage; neither is a state prop.
export const stateAsProp = <FloatingPanel title="INSPECTOR" state="Focus" />
