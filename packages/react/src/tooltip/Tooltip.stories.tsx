import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { CopyIcon } from '../icons/CopyIcon'
import { Tooltip } from './Tooltip'


/**
 * Figma: Steelbook Design System › Tooltip (node `33:2`).
 *
 * Hover or tab to the control to raise the chip; Escape dismisses it.
 * The trigger is the caller's own element — Ark's trigger props are
 * spread onto it rather than wrapping it in a second button.
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: {
    label: 'Copy to clipboard',
    children: (
      <Button tone="secondary" iconLeft={<CopyIcon />}>
        Copy
      </Button>
    ),
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn chip, hanging under the control it describes. */
export const Default: Story = {}

/** Held open, so the chip can be measured against the Figma frame. */
export const Open: Story = {
  args: { open: true },
}

/** Above the trigger instead of below — placement is Ark's, not drawn. */
export const Top: Story = {
  args: { open: true, positioning: { placement: 'top' } },
}

/** No delay, for when the tooltip labels a dense row of controls. */
export const Instant: Story = {
  args: { openDelay: 0, closeDelay: 0 },
}

/** A longer label. The chip hugs one line however long it runs. */
export const LongLabel: Story = {
  args: { open: true, label: 'Copy the current selection to the clipboard' },
}
