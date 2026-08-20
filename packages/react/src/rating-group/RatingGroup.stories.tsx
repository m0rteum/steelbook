import type { Meta, StoryObj } from '@storybook/react-vite'
import { RatingGroup } from './RatingGroup'

/**
 * Figma: Steelbook Design System › Rating Group (node `25:68`).
 *
 * The Value axis (0–5) is the numeric value. Hover the stars to
 * preview a score, click to set it.
 */
const meta = {
  title: 'Components/RatingGroup',
  component: RatingGroup,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 1 } },
  },
  args: { 'aria-label': 'Rate this release' },
} satisfies Meta<typeof RatingGroup>

export default meta
// Typed off the component rather than the meta: RatingGroupProps is a
// union (one name source or the other), and meta-based arg inference
// collapses a union with `never` members to `never`.
type Story = StoryObj<typeof RatingGroup>

/** Playground — click or drag the value control. */
export const Playground: Story = {
  args: { defaultValue: 3 },
}

/** The six drawn values, 0 through 5. */
export const DrawnValues: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[0, 1, 2, 3, 4, 5].map((value) => (
        <RatingGroup key={value} value={value} readOnly aria-label={`${value} out of 5`} />
      ))}
    </div>
  ),
}
