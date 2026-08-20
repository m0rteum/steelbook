import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

/**
 * Figma: Steelbook Design System › Tag (node `30:10`).
 *
 * Two tones, and a × that appears only when the tag is given something
 * to do on removal.
 */
const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: 'steel', onRemove: () => {}, removeLabel: 'Remove steel' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof Tag>

/** Tone=Solid — committed values. */
export const Solid: Story = {}

/** Tone=Outline — suggestions. */
export const Outline: Story = {
  args: { tone: 'outline' },
}

/** Removable=false — no handler, no ×. */
export const NotRemovable: Story = {
  args: { onRemove: undefined, removeLabel: undefined },
}
