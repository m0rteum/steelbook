import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberInput } from './NumberInput'

/**
 * Figma: Steelbook Design System › Number Input (node `28:38`).
 *
 * State maps to interaction: click into the field for the Focus skin,
 * step with the chips or the arrow keys, and `disabled` for the third
 * variant.
 */
const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Quantity', defaultValue: '128' },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default. */
export const Default: Story = {}

/** Clamped to a range — the chips disable themselves at the ends. */
export const Clamped: Story = {
  args: { defaultValue: '2', min: 0, max: 3 },
}

/** State=Disabled — label, input and both chips grey out together. */
export const Disabled: Story = {
  args: { disabled: true },
}
