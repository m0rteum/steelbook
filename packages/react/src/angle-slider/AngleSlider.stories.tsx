import type { Meta, StoryObj } from '@storybook/react-vite'
import { AngleSlider } from './AngleSlider'

/**
 * Figma: Steelbook Design System › Angle Slider (node `22:64`).
 *
 * The Angle axis (0 | 45 | 90 | 180 | 270 as drawn) is the numeric
 * value — zero points up and the needle sweeps clockwise. Drag the
 * dial or tab to it and use the arrow keys.
 */
const meta = {
  title: 'Components/AngleSlider',
  component: AngleSlider,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 359, step: 1 } },
  },
  args: { 'aria-label': 'Gradient angle' },
} satisfies Meta<typeof AngleSlider>

export default meta
// Typed off the component rather than the meta: AngleSliderProps is a
// union (one name source or the other), and meta-based arg inference
// collapses a union with `never` members to `never`.
type Story = StoryObj<typeof AngleSlider>

/** Playground — drag the value control and watch the needle sweep. */
export const Playground: Story = {
  args: { defaultValue: 45 },
}

/** The five drawn stops. */
export const DrawnAngles: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
      <AngleSlider defaultValue={0} aria-label="Angle 0" />
      <AngleSlider defaultValue={45} aria-label="Angle 45" />
      <AngleSlider defaultValue={90} aria-label="Angle 90" />
      <AngleSlider defaultValue={180} aria-label="Angle 180" />
      <AngleSlider defaultValue={270} aria-label="Angle 270" />
    </div>
  ),
}

/**
 * State the design does not draw — the standard Steelbook disabled
 * tokens, applied so a dead dial cannot pass for a live one.
 */
export const Disabled: Story = {
  args: { defaultValue: 45, disabled: true },
}
