import type { ReactNode } from 'react'
import { Steps as ArkSteps, type StepsRootProps } from '@ark-ui/react/steps'
import { CheckIcon } from '../icons/CheckIcon'
import './Steps.css'

export type StepsProps = Omit<StepsRootProps, 'children' | 'count'> & {
  /**
   * Figma's `Label` property, one per rung, in order. The count comes
   * from the length and the number on each indicator from its position,
   * so there is nothing to keep in sync.
   */
  steps: ReactNode[]
}

/**
 * A horizontal wizard rail: orange check for done, black block for you
 * are here, outline for later. Connectors darken as you pass them.
 *
 * Both Figma components live here. The `State` axis on Step — Complete,
 * Current, Upcoming — is not a choice a caller makes: the machine
 * derives it from the current step and the position, and the `Number`
 * on each indicator is that position. A separately mountable Step would
 * need an index and a matching `count` kept in step with it by hand, so
 * the rail takes the labels and does both, the way Pagination renders
 * its own cells.
 *
 * The connector belongs to the rung behind it — dark once that rung is
 * complete, muted until then — which is what "connectors darken as you
 * pass them" describes. The last rung has none.
 *
 * Figma draws no interaction states for a Step, unlike every other
 * clickable thing in the file, which all carry an Interaction axis. Ark
 * still renders each rung as a button so the rail can be walked from the
 * keyboard, so it takes the house focus ring on the indicator and
 * nothing else — no hover skin was invented.
 *
 * @example
 * ```tsx
 * <Steps steps={['Cart', 'Shipping', 'Payment', 'Done']} defaultStep={1} />
 * ```
 *
 * Figma: Steelbook Design System › Steps (node `31:242`) and Step
 * (node `31:241`).
 * Built on [Ark UI Steps](https://ark-ui.com/docs/components/steps).
 */
export function Steps({ steps, className, ...props }: StepsProps) {
  return (
    <ArkSteps.Root
      {...props}
      count={steps.length}
      className={className ? `sb-steps ${className}` : 'sb-steps'}
    >
      <ArkSteps.List className="sb-steps__list">
        {steps.map((label, index) => (
          // eslint-disable-next-line react/no-array-index-key -- the index is the identity
          <ArkSteps.Item key={index} index={index} className="sb-steps__item">
            <ArkSteps.Trigger className="sb-steps__trigger">
              <ArkSteps.Indicator className="sb-steps__indicator">
                {/* Ark marks the indicator aria-hidden, so both glyphs are
                    decorative and the trigger is named by its label. */}
                <CheckIcon className="sb-steps__check" />
                <span className="sb-steps__number">{index + 1}</span>
              </ArkSteps.Indicator>
              <span className="sb-steps__label">{label}</span>
            </ArkSteps.Trigger>
            {index < steps.length - 1 ? (
              <ArkSteps.Separator className="sb-steps__separator" />
            ) : null}
          </ArkSteps.Item>
        ))}
      </ArkSteps.List>
    </ArkSteps.Root>
  )
}
