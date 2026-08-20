import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './Slider'

/**
 * Figma: Steelbook Design System › Slider (node `22:38`).
 *
 * Variant axes: Type (Single|Range) × State (Default|Hover|Focus|
 * Disabled). Type is the shape of the value — one number or two.
 * Hover and Focus are interaction skins: hover a thumb to see it turn
 * orange, tab to it for the 3px ring.
 */
const meta = {
  title: 'Components/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
  args: { 'aria-label': 'Volume' },
} satisfies Meta<typeof Slider>

export default meta
// Typed off the component rather than the meta: SliderProps is a union
// (one name source or the other), and meta-based arg inference collapses
// a union with `never` members to `never`.
type Story = StoryObj<typeof Slider>

/** Type=Single — one thumb, filled from the start of the rail. */
export const Single: Story = {
  args: { defaultValue: [60] },
}

/** Type=Range — two thumbs, filled between them. */
export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    'aria-label': ['Minimum price', 'Maximum price'],
  },
}

/** State=Disabled — one skin for both types. */
export const Disabled: Story = {
  args: { defaultValue: [60], disabled: true, 'aria-label': 'Volume' },
  // Written out rather than spread: SliderProps is a union (one name
  // source or the other), and spreading it into a second Slider with a
  // different name shape collapses to never.
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Slider defaultValue={[60]} disabled aria-label="Volume" />
      <Slider defaultValue={[25, 75]} disabled aria-label={['Minimum', 'Maximum']} />
    </div>
  ),
}
