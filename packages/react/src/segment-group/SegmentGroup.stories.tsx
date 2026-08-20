import type { Meta, StoryObj } from '@storybook/react-vite'
import { Segment, SegmentGroup } from './SegmentGroup'

/**
 * Figma: Steelbook Design System › Segment Group (node `30:178`) and
 * Segment (node `30:166`).
 *
 * Click or arrow-key between the cells — exactly one is black. Hover an
 * unselected cell to see it go muted; the selected one does not move.
 */
const meta = {
  title: 'Components/SegmentGroup',
  component: SegmentGroup,
  args: { defaultValue: 'monthly', 'aria-label': 'Billing period' },
  render: (args) => (
    <SegmentGroup {...args}>
      <Segment value="monthly">Monthly</Segment>
      <Segment value="quarterly">Quarterly</Segment>
      <Segment value="yearly">Yearly</Segment>
    </SegmentGroup>
  ),
} satisfies Meta<typeof SegmentGroup>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn group: three fused cells, Monthly selected. */
export const Default: Story = {}

/** Interaction=Disabled on the whole group — every cell greys, selected or not. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Interaction=Disabled on one cell, with the rest still live. */
export const OneDisabled: Story = {
  render: (args) => (
    <SegmentGroup {...args}>
      <Segment value="monthly">Monthly</Segment>
      <Segment value="quarterly" disabled>
        Quarterly
      </Segment>
      <Segment value="yearly">Yearly</Segment>
    </SegmentGroup>
  ),
}
