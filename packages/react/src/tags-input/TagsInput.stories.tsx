import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsInput } from './TagsInput'

/**
 * Figma: Steelbook Design System › Tags Input (node `30:43`).
 *
 * Type and press Enter to add a tag, Backspace on an empty entry to
 * highlight and then pop the last one, and click a chip's × to remove
 * it. Focus is Ark's own `data-focus` on the control.
 */
const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Materials',
    defaultValue: ['gunmetal', 'concrete', 'rebar'],
    placeholder: 'Add material…',
  },
} satisfies Meta<typeof TagsInput>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — three committed tags and the placeholder. */
export const Default: Story = {}

/** Empty — nothing committed yet, so the box is the entry alone. */
export const Empty: Story = {
  args: { defaultValue: [] },
}
