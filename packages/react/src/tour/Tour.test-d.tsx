/**
 * Compile-time conformance test: the machine is held outside the
 * component and handed in, the coach mark is fully drawn so nothing
 * composes into it, and the step data is Ark's own.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TourProps breaks typecheck here. The hooks below sit
 * inside components only so the code reads the way it would be written.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Tour, useTour, type TourStep } from './Tour'

const steps: TourStep[] = [
  {
    id: 'tokens',
    target: () => document.querySelector<HTMLElement>('#token-panel'),
    title: 'THIS IS YOUR TOKEN PANEL',
    description: 'Every color you see resolves through here.',
  },
  {
    id: 'done',
    type: 'dialog',
    title: 'THAT IS THE TOUR',
    description: 'Go and change something.',
    actions: [{ label: 'Finish', action: 'dismiss' }],
  },
]

// Accepted — the drawn tour.
export function Basic() {
  const tour = useTour({ steps })
  return <Tour tour={tour} />
}

// Accepted — a class of the caller's, on the drawn box.
export function Styled() {
  const tour = useTour({ steps })
  return <Tour tour={tour} className="my-tour" />
}

// Accepted — the machine's own switches reach it through the hook.
export function MachineProps() {
  const tour = useTour({
    steps,
    closeOnEscape: false,
    closeOnInteractOutside: false,
    keyboardNavigation: false,
    preventInteraction: true,
    spotlightRadius: 8,
    onStepChange: ({ stepId }) => void stepId,
    onStatusChange: ({ status }) => void status,
  })
  return <Tour tour={tour} />
}

// Accepted — the drawn separator can be replaced for another language.
export function Translated() {
  const tour = useTour({
    steps,
    translations: { close: 'Tour schließen', progressText: ({ current }) => `${current + 1}` },
  })
  return <Tour tour={tour} />
}

export function Rejections() {
  const tour = useTour({ steps })
  return (
    <>
      {/* @ts-expect-error — the coach mark is fully drawn; nothing composes into it. */}
      <Tour tour={tour}>extra</Tour>
      {/* @ts-expect-error — the machine is required; the component only renders it. */}
      <Tour />
      {/* @ts-expect-error — steps go to the hook, not the component. */}
      <Tour tour={tour} steps={steps} />
      {/* @ts-expect-error — the frame draws no arrow, so there is no switch for one. */}
      <Tour tour={tour} arrow />
      {/* @ts-expect-error — open / closed is the machine's, driven by start() and dismiss(). */}
      <Tour tour={tour} open />
    </>
  )
}

// @ts-expect-error — every step needs an id; Ark keys the machine on it.
export const unidentifiedStep: TourStep[] = [{ title: 'A', description: 'B' }]
