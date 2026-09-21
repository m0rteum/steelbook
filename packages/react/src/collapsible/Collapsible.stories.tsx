import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible } from './Collapsible'

/**
 * Figma: Steelbook Design System › Collapsible (node `31:43`).
 *
 * Only the closed trigger row is drawn. The content panel, the open
 * state and every interaction state are undrawn; see the component
 * JSDoc for how each one ships. Stories use the frame's 480.
 */
const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Show advanced options',
    children:
      'The content panel is not drawn in Figma. It ships as an unstyled slot — this paragraph carries whatever the caller gives it.',
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn row: closed, 480 × 41. */
export const Default: Story = {}

/** Open. Undrawn — the panel shows and the chevron stays as drawn. */
export const Open: Story = {
  args: { defaultOpen: true },
}

/** Disabled. Undrawn — the house inks with `cursor: not-allowed`. */
export const Disabled: Story = {
  args: { disabled: true },
}
