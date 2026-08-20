import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from './Toggle'
import { ArrowRightIcon } from '../icons/ArrowRightIcon'

/**
 * Figma: Steelbook Design System › Toggle (node `19:26`).
 *
 * Variant axes: Pressed (False|True) × Interaction
 * (Default|Hover|Focus|Disabled). Hover and Focus are interaction
 * skins driven by the user; Pressed and Disabled are reachable here.
 * The Icon swap property defaults to `icon/star`.
 */
const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    icon: { control: false },
  },
  args: { 'aria-label': 'Favourite' },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/** Pressed=False, default icon (star). */
export const Default: Story = {}

/** Pressed=True — the chip inverts: black fill, white glyph. */
export const Pressed: Story = {
  args: { defaultPressed: true },
}

/** Interaction=Disabled, identical for both pressed states. */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Toggle {...args} disabled />
      <Toggle {...args} disabled defaultPressed />
    </div>
  ),
}

/** The Icon swap slot with a non-default Steelbook glyph. */
export const SwappedIcon: Story = {
  args: { 'aria-label': 'Continue', icon: <ArrowRightIcon /> },
}
