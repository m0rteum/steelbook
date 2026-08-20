import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

/**
 * Figma: Steelbook Design System › Checkbox (node `17:54`).
 *
 * Variant axes: State (Unchecked|Checked|Indeterminate) × Interaction
 * (Default|Hover|Focus|Disabled), plus the Show label boolean. Hover and
 * Focus are interaction skins driven by Ark's data attributes; State and
 * Disabled are reachable here.
 */
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { children: 'Accept the terms' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** State=Unchecked. */
export const Default: Story = {}

/** State=Checked — safety orange with a black check. */
export const Checked: Story = {
  args: { defaultChecked: true },
}

/** State=Indeterminate — a black bar on the same orange. */
export const Indeterminate: Story = {
  args: { defaultChecked: 'indeterminate' },
}

/**
 * Figma `Show label=false`: the label leaves the screen but stays in the
 * accessibility tree (Ark's aria-labelledby still points at it).
 */
export const HiddenLabel: Story = {
  args: { hideLabel: true, children: 'Select row' },
}

/** Interaction=Disabled — one skin for all three states. */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox {...args} disabled>Unchecked and disabled</Checkbox>
      <Checkbox {...args} disabled defaultChecked>Checked and disabled</Checkbox>
      <Checkbox {...args} disabled defaultChecked="indeterminate">
        Indeterminate and disabled
      </Checkbox>
    </div>
  ),
}
