import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'

/**
 * Figma: Steelbook Design System › Field (node `27:58`).
 *
 * Variant axes: State (Default|Focus|Error|Disabled) × Value
 * (Empty|Filled), plus Show helper and Required booleans. Focus is an
 * interaction skin (:focus on the input); Value is the input's own
 * content; Error is the presence of the error sentence.
 */
const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    label: 'Email address',
    helper: 'We only use this for receipts.',
    placeholder: 'you@company.com',
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default, Value=Empty — placeholder in the drawn text. */
export const Default: Story = {}

/** State=Default, Value=Filled. */
export const Filled: Story = {
  args: { defaultValue: 'you@company.com', placeholder: undefined },
}

/** Required boolean — the accent asterisk rides the label. */
export const Required: Story = {
  args: { required: true },
}

/** State=Error — 3px danger border, sentence replaces the helper. */
export const Error: Story = {
  args: { error: 'That address has no @ sign.', defaultValue: 'you.company.com' },
}

/** State=Disabled — one skin for empty and filled. */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Field {...args} disabled />
      <Field {...args} disabled defaultValue="you@company.com" placeholder={undefined} />
    </div>
  ),
}
