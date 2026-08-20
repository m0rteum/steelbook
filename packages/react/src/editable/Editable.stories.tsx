import type { Meta, StoryObj } from '@storybook/react-vite'
import { Editable } from './Editable'

/**
 * Figma: Steelbook Design System › Editable (node `26:15`).
 *
 * The Mode axis is Ark's own state: click the value to enter Edit,
 * then confirm / cancel (or Enter / Escape) to leave it.
 */
const meta = {
  title: 'Components/Editable',
  component: Editable,
  args: { defaultValue: 'Project title' },
} satisfies Meta<typeof Editable>

export default meta
type Story = StoryObj<typeof meta>

/** Mode=Preview — the value with its pen hint. Click it to edit. */
export const Preview: Story = {}

/** Mode=Edit — the focus-ringed input with confirm and cancel. */
export const Edit: Story = {
  args: { defaultEdit: true },
}

/**
 * State the design does not draw — the standard Steelbook disabled
 * tokens, applied so a dead control cannot pass for a live one.
 */
export const Disabled: Story = {
  args: { disabled: true },
}
