import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

/**
 * Figma: Steelbook Design System › Toggle Group (node `19:27`).
 *
 * The component draws a single state: three star Toggles with collapsed
 * 2px borders, the first pressed. Everything else (hover, focus,
 * disabled, pressed) belongs to the chips and is an interaction skin.
 * Multiple chips may be pressed — click around to see it.
 */
const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** As drawn: three chips, first pressed, 116px total (40 × 3 − 2 × 2). */
export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args} defaultValue={['first']}>
      <ToggleGroupItem value="first" aria-label="First" />
      <ToggleGroupItem value="second" aria-label="Second" />
      <ToggleGroupItem value="third" aria-label="Third" />
    </ToggleGroup>
  ),
}
