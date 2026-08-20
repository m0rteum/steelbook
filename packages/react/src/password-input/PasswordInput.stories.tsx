import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordInput } from './PasswordInput'

/**
 * Figma: Steelbook Design System › Password Input (node `29:50`).
 *
 * Visibility is Ark's state — click the eye to reveal and watch it
 * flip to eye-off. Focus is the input taking focus; Disabled is the
 * prop.
 */
const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Password', defaultValue: 'hunter2!!!' },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

/** Visibility=Hidden — mono bullets behind the eye. */
export const Hidden: Story = {}

/** Visibility=Visible — the value in the clear, eye flipped to eye-off. */
export const Visible: Story = {
  args: { defaultVisible: true },
}

/** State=Disabled — label, frame and value grey out together. */
export const Disabled: Story = {
  args: { disabled: true },
}
