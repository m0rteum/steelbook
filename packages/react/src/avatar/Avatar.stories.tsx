import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

/**
 * Figma: Steelbook Design System › Avatar (node `20:22`).
 *
 * Variant axes: Size (sm|md|lg|xl) × Type (Initials|Icon). Type is the
 * presence of `initials`; a `src` layers a photo over either fallback
 * with the ring and clip intact.
 */
const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: { initials: 'SB', size: 'sm' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Type=Initials across the size axis. */
export const Initials: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
}

/** Type=Icon — the user glyph fallback, across the size axis. */
export const Icon: Story = {
  args: { initials: undefined },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
}

/** A photo dropped on the instance — the ring and clip stay. */
export const Photo: Story = {
  args: {
    size: 'xl',
    initials: 'SB',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112"><rect width="112" height="112" fill="%23525252"/><circle cx="56" cy="42" r="20" fill="%23a3a3a3"/><rect x="20" y="70" width="72" height="42" rx="21" fill="%23a3a3a3"/></svg>',
    alt: 'Placeholder portrait',
  },
}
