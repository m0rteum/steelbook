import type { Meta, StoryObj } from '@storybook/react-vite'
import { PinInput } from './PinInput'

/**
 * Figma: Steelbook Design System › PIN Input (node `29:81`).
 *
 * Focus is a real `:focus` — click or tab into a cell and type; Ark
 * advances on its own and accepts a pasted code. Error and Disabled are
 * Ark's `invalid` and `disabled` props.
 */
const meta = {
  title: 'Components/PinInput',
  component: PinInput,
} satisfies Meta<typeof PinInput>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — four empty cells. */
export const Default: Story = {}

/** State=Focus — click the third cell; only that cell rings accent. */
export const Focus: Story = {
  args: { defaultValue: ['4', '8'] },
}

/** State=Error — all four redden, filled or not. */
export const Error: Story = {
  args: { invalid: true, defaultValue: ['4', '8', '1', '5'] },
}

/** State=Disabled — cells, borders and glyphs grey out together. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['4', '8'] },
}
