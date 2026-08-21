import type { Meta, StoryObj } from '@storybook/react-vite'
import { Combobox } from './Combobox'

/**
 * Figma: Steelbook Design System › Combobox (node `38:26`) and Combobox
 * / Open (node `38:27`).
 *
 * Type to filter, arrows walk the hits, Enter selects, Escape closes;
 * the chevron toggles the whole list. The control's border thickens and
 * turns accent while focused, which is what the Filtering variant
 * draws.
 *
 * The control fills its container, as Field does; the 280px in the
 * frame is the container's width. The results panel stays at the
 * Listbox's drawn 240.
 */
const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '280px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Assignee',
    placeholder: 'Search people…',
    items: [
      { value: 'brianna', label: 'Brianna Wolfe' },
      { value: 'bright', label: 'Bright Osei' },
      { value: 'gabriel', label: 'Gabriel Brito' },
      { value: 'dana', label: 'Dana Okonkwo' },
      { value: 'mira', label: 'Mira Halvorsen' },
    ],
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — empty input, the placeholder in grey. */
export const Default: Story = {}

/**
 * State=Filtering, as the open frame draws it: the query "bri" leaves
 * three hits — the third matching inside "Gabriel" — with the first
 * highlighted.
 */
export const Filtering: Story = {
  args: { open: true, inputValue: 'bri' },
}

/** State=Disabled — muted label, muted frame, muted chevron. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** The whole list, opened from the chevron rather than by typing. */
export const Open: Story = {
  args: { open: true },
}

/** A chosen row keeps its check and accent label when the list reopens. */
export const WithValue: Story = {
  args: { open: true, defaultValue: ['bright'], defaultInputValue: 'Bright Osei' },
}

/** A disabled choice: muted row, no hover fill, skipped by the keyboard. */
export const WithDisabledItem: Story = {
  args: {
    open: true,
    items: [
      { value: 'brianna', label: 'Brianna Wolfe' },
      { value: 'bright', label: 'Bright Osei', disabled: true },
      { value: 'gabriel', label: 'Gabriel Brito' },
    ],
  },
}

/**
 * A query that matches nothing. The design draws no empty state, so
 * none ships — the panel is simply empty. Raised in Figma.
 */
export const NoMatches: Story = {
  args: { open: true, inputValue: 'zzz' },
}
