import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

/**
 * Figma: Steelbook Design System › Select (node `37:48`) and Select /
 * Open (node `37:49`).
 *
 * Click or press Enter on the trigger to open; arrows walk the choices,
 * typing jumps to one, Enter selects and Escape closes. The trigger's
 * border thickens and turns accent while open — and while focused but
 * still closed, which the design does not draw but Field answers the
 * same way.
 *
 * The control fills its container, as Field does; the 260px in the
 * frame is the container's width. The dropdown stays at the Listbox's
 * drawn 240.
 */
const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '260px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Material',
    placeholder: 'Choose material…',
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'concrete', label: 'Concrete' },
      { value: 'rebar', label: 'Rebar' },
      { value: 'blast-furnace', label: 'Blast furnace' },
      { value: 'safety-orange', label: 'Safety orange' },
    ],
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — closed, nothing chosen, the placeholder in grey. */
export const Default: Story = {}

/** State=Open — the trigger's accent border and the floating Listbox. */
export const Open: Story = {
  args: { open: true, defaultValue: ['gunmetal'] },
}

/** State=Disabled — muted label, muted frame, muted glyph. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Closed with a choice made: the value reads primary, not placeholder. */
export const WithValue: Story = {
  args: { defaultValue: ['gunmetal'] },
}

/** A disabled choice: muted row, no hover fill, skipped by the keyboard. */
export const WithDisabledItem: Story = {
  args: {
    open: true,
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'concrete', label: 'Concrete', disabled: true },
      { value: 'rebar', label: 'Rebar' },
    ],
  },
}

/** A value longer than the trigger truncates rather than wrapping. */
export const LongValue: Story = {
  args: {
    defaultValue: ['weathering'],
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'weathering', label: 'Weathering steel with a rust patina' },
    ],
  },
}
