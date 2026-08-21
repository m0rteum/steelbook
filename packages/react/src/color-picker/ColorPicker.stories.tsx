import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { parseColor } from '@ark-ui/react/color-picker'
import { ColorPicker } from './ColorPicker'

/**
 * Figma: Steelbook Design System › Color Picker (node `43:2`).
 *
 * Drag in the field to set saturation and brightness, drag the rail to
 * set hue, type into the hex box, or click a preset. Both thumbs take
 * the arrow keys once focused.
 *
 * The two gradients are painted by Ark from the live colour, not by the
 * stylesheet — which is how the only gradients in Steelbook stay out of
 * a Steelbook stylesheet. They are data, not decoration.
 *
 * The panel is always inline: the frame draws it with no trigger.
 */
const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn panel, holding bg/accent. */
export const Default: Story = {}

/** Another starting colour; the field and rail repaint around it. */
export const Blue: Story = {
  args: { defaultValue: parseColor('#0866ff') },
}

/** Black — the field collapses to its value axis. */
export const Black: Story = {
  args: { defaultValue: parseColor('#000000') },
}

/** A shorter preset row of the caller's own. */
export const CustomPresets: Story = {
  args: {
    defaultValue: parseColor('#00c853'),
    presets: ['#00c853', '#ffd600', '#f42b1d'],
  },
}

/** Read-only: the value shows but nothing moves it. */
export const ReadOnly: Story = {
  args: { readOnly: true },
}

/** Disabled, which Ark marks on every part. */
export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * Controlled from outside — the value is held in React and echoed above,
 * so the round trip through `onValueChange` is visible.
 */
export const Controlled: Story = {
  render: function ControlledStory() {
    const [color, setColor] = useState(() => parseColor('#ffd600'))
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-gap-sm)' }}>
        <output
          style={{
            fontFamily: 'var(--sb-text-mono-md-family)',
            fontSize: 'var(--sb-text-mono-md-size)',
            color: 'var(--sb-text-secondary)',
          }}
        >
          {color.toString('hex')}
        </output>
        <ColorPicker value={color} onValueChange={({ value }) => setColor(value)} name="brand" />
      </div>
    )
  },
}
