import type { Meta, StoryObj } from '@storybook/react-vite'
import { Listbox } from './Listbox'

/**
 * Figma: Steelbook Design System › Listbox (node `37:17`) and Listbox
 * Option (node `37:16`).
 *
 * Tab into the panel, then arrows walk the rows, typing jumps to one and
 * Enter or Space selects. The highlighted row is the one under the
 * pointer or the one the keyboard is on — Figma's `Interaction=Hover`
 * covers both.
 *
 * A selected row is marked by ink rather than weight — the label turns
 * accent and the check appears — so every row stays 42 tall and the list
 * holds still as the selection moves.
 */
const meta = {
  title: 'Components/Listbox',
  component: Listbox,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Palette',
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'concrete', label: 'Concrete' },
      { value: 'rebar', label: 'Rebar' },
      { value: 'blast-furnace', label: 'Blast furnace' },
      { value: 'safety-orange', label: 'Safety orange' },
    ],
  },
} satisfies Meta<typeof Listbox>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn list — the first row selected. */
export const Default: Story = {
  args: { defaultValue: ['gunmetal'] },
}

/** Nothing chosen yet: every row on the base skin. */
export const NoSelection: Story = {}

/** A disabled row: muted label, no hover fill, skipped by the keyboard. */
export const WithDisabledOption: Story = {
  args: {
    defaultValue: ['gunmetal'],
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'concrete', label: 'Concrete', disabled: true },
      { value: 'rebar', label: 'Rebar' },
    ],
  },
}

/** Several rows at once — single is drawn, but the mode is Ark's. */
export const Multiple: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['gunmetal', 'rebar'] },
}

/**
 * Named by reference instead: Ark's label id is redirected at the
 * caller's own heading, so nothing hidden is rendered.
 */
export const NamedByReference: Story = {
  args: { 'aria-label': undefined, 'aria-labelledby': 'palette-heading', defaultValue: ['gunmetal'] },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-gap-xs)' }}>
      <h3 id="palette-heading" style={{ margin: 0, font: 'var(--sb-text-label-md-weight) var(--sb-text-label-md-size)/1.2 var(--sb-text-label-md-family)' }}>
        Palette
      </h3>
      <Listbox {...args} />
    </div>
  ),
}

/** A label longer than the 240px panel wraps and grows its row. */
export const LongLabel: Story = {
  args: {
    defaultValue: ['gunmetal'],
    items: [
      { value: 'gunmetal', label: 'Gunmetal' },
      { value: 'weathering', label: 'Weathering steel with a rust patina' },
      { value: 'rebar', label: 'Rebar' },
    ],
  },
}
