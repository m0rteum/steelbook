import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from './RadioGroup'

/**
 * Figma: Steelbook Design System › Radio Group (node `18:31`) and
 * Radio (node `18:30`).
 *
 * Radio's variant axes: Selected (False|True) × Interaction
 * (Default|Hover|Focus|Disabled). Selected is the group's value;
 * Hover and Focus are interaction skins; Disabled is reachable here.
 */
const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

/** As drawn: vertical stack, gap/sm, exactly one selected. */
export const Default: Story = {
  args: {
    defaultValue: 'standard',
    children: (
      <>
        <Radio value="standard">Standard shipping</Radio>
        <Radio value="express">Express shipping</Radio>
        <Radio value="overnight">Overnight freight</Radio>
      </>
    ),
  },
}

/** Interaction=Disabled — one skin for both selected states. */
export const Disabled: Story = {
  args: {
    defaultValue: 'standard',
    disabled: true,
    children: (
      <>
        <Radio value="standard">Selected and disabled</Radio>
        <Radio value="express">Unselected and disabled</Radio>
      </>
    ),
  },
}
