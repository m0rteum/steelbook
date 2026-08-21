import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from './DatePicker'

/** The date the frames were drawn around, and the one they select. */
const AUG_21 = new CalendarDate(2026, 8, 21)

/**
 * Figma: Steelbook Design System › Calendar Day (node `38:299`),
 * Calendar (node `39:2`), Date Input (node `39:128`) and Date Picker /
 * Open (node `39:129`) — all four one component.
 *
 * Type a date as `DD / MM / YYYY`, or open the calendar from the glyph
 * and walk the grid with the arrow keys. The control's border thickens
 * and turns accent while focused and while the calendar is open.
 *
 * The control fills its container, as Field does; the 240px in the
 * frame is the container's width. The calendar keeps its drawn 282,
 * which the 7 × 34 grid fixes.
 *
 * The frames were drawn against August 2026, with the 18th as today and
 * the 21st selected. These stories pin the same month so the grid can be
 * measured against them. Dates are `@internationalized/date` values,
 * which is the type Ark's machine works in.
 */
const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '240px' }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Ship date' },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — empty input showing the DD / MM / YYYY mask. */
export const Default: Story = {}

/** State=Focus — a value typed in, the border accent. */
export const WithValue: Story = {
  args: { defaultValue: [AUG_21] },
}

/** State=Disabled — muted label, muted frame, muted glyph. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: [AUG_21] },
}

/**
 * Date Picker / Open — the calendar as drawn: August 2026, the 21st
 * selected, six week rows with July spilling into the first and
 * September into the last.
 */
export const Open: Story = {
  args: {
    open: true,
    defaultValue: [AUG_21],
    defaultFocusedValue: AUG_21,
  },
}

/** The calendar with nothing chosen yet — no accent block on the grid. */
export const OpenEmpty: Story = {
  args: { open: true, defaultFocusedValue: AUG_21 },
}

/**
 * Bounded by `min` and `max`: days outside the window take the disabled
 * ink, and a nav button that would leave the window disables itself.
 */
export const Bounded: Story = {
  args: {
    open: true,
    defaultFocusedValue: AUG_21,
    min: new CalendarDate(2026, 8, 10),
    max: new CalendarDate(2026, 8, 24),
  },
}

/** A Sunday start, for locales that begin the week there. */
export const SundayStart: Story = {
  args: { open: true, startOfWeek: 0, defaultFocusedValue: AUG_21 },
}
