import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressCircular } from './ProgressCircular'

/**
 * Figma: Steelbook Design System › Progress / Circular (node `21:31`).
 *
 * One drawn skin; the Value axis (0|25|50|75|100 as drawn) is the
 * numeric `value` prop — the drawn variants are sample stops.
 */
const meta = {
  title: 'Components/ProgressCircular',
  component: ProgressCircular,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: { 'aria-label': 'Progress', value: 50 },
} satisfies Meta<typeof ProgressCircular>

export default meta
type Story = StoryObj<typeof meta>

/** Playground — drag the value control and watch the arc sweep. */
export const Playground: Story = {}

/** The five drawn stops. */
export const DrawnStops: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <ProgressCircular {...args} value={0} />
      <ProgressCircular {...args} value={25} />
      <ProgressCircular {...args} value={50} />
      <ProgressCircular {...args} value={75} />
      <ProgressCircular {...args} value={100} />
    </div>
  ),
}
