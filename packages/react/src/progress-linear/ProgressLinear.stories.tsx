import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressLinear } from './ProgressLinear'

/**
 * Figma: Steelbook Design System › Progress / Linear (node `21:11`).
 *
 * One drawn skin; the Value axis (0|25|50|75|100 as drawn) is the
 * numeric `value` prop — the drawn variants are sample stops.
 */
const meta = {
  title: 'Components/ProgressLinear',
  component: ProgressLinear,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: { 'aria-label': 'Progress', value: 50 },
} satisfies Meta<typeof ProgressLinear>

export default meta
type Story = StoryObj<typeof meta>

/** Playground — drag the value control. */
export const Playground: Story = {}

/** The five drawn stops. */
export const DrawnStops: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 240 }}>
      <ProgressLinear {...args} value={0} />
      <ProgressLinear {...args} value={25} />
      <ProgressLinear {...args} value={50} />
      <ProgressLinear {...args} value={75} />
      <ProgressLinear {...args} value={100} />
    </div>
  ),
}
