import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

/**
 * Figma: Steelbook Design System › Switch (node `18:94`).
 *
 * Variant axes: Checked (False|True) × Interaction
 * (Default|Hover|Focus|Disabled), plus the `showLabel` property
 * (mirrored as `hideLabel`). Hover and Focus are interaction skins
 * driven by Ark's data attributes; Checked and Disabled are reachable
 * here.
 */
const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { children: 'Dark mode' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/** Checked=False. */
export const Default: Story = {}

/** Checked=True — on is safety orange. */
export const Checked: Story = {
  args: { defaultChecked: true },
}

/**
 * Figma `showLabel=false`: the label leaves the screen but stays in
 * the accessibility tree (Ark's aria-labelledby still points at it).
 */
export const HiddenLabel: Story = {
  args: { hideLabel: true, children: 'Mute notifications' },
}

/** Interaction=Disabled, identical for both checked states. */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch {...args} disabled>Off and disabled</Switch>
      <Switch {...args} disabled defaultChecked>On and disabled</Switch>
    </div>
  ),
}
