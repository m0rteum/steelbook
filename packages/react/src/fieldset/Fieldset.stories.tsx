import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../field/Field'
import { Fieldset } from './Fieldset'

/**
 * Figma: Steelbook Design System › Fieldset (node `27:139`).
 *
 * No variant axes — legend and hint are text properties, and every
 * state belongs to the Fields inside. `disabled` on the fieldset
 * reaches each Field through Ark's context.
 */
const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  args: {
    legend: 'SHIPPING',
    hint: 'Where the crate lands. All fields required.',
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

/** As drawn: legend, hint, two Fields on the 16px rhythm, 3px top rule. */
export const Default: Story = {
  args: {
    children: (
      <>
        <Field
          label="Email address"
          helper="We only use this for receipts."
          placeholder="you@company.com"
        />
        <Field
          label="Email address"
          helper="We only use this for receipts."
          placeholder="you@company.com"
        />
      </>
    ),
  },
  render: (args) => (
    <div style={{ width: 400 }}>
      <Fieldset {...args} />
    </div>
  ),
}
