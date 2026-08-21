import type { Meta, StoryObj } from '@storybook/react-vite'
import { LocaleProvider } from '@ark-ui/react/locale'
import { Button } from '../button/Button'
import { Field } from '../field/Field'
import { Drawer } from './Drawer'

const bodySm = {
  margin: 0,
  fontFamily: 'var(--sb-text-body-sm-family)',
  fontWeight: 'var(--sb-text-body-sm-weight)',
  fontSize: 'var(--sb-text-body-sm-size)',
  lineHeight: 'var(--sb-text-body-sm-line-height)',
  color: 'var(--sb-text-secondary)',
} as const

const footer = (
  <>
    <Button size="md" tone="ghost">
      Reset
    </Button>
    <Button size="md" tone="primary">
      Apply
    </Button>
  </>
)

/**
 * Figma: Steelbook Design System › Drawer (node `41:493`), with the
 * overlay from Example / Drawer over canvas (node `41:513`).
 *
 * A full-height sheet on the trailing edge behind a 3px spine, with a
 * rule under the header and another over the footer. The middle is a
 * slot — the frame's own copy says to drop Fields, Checkboxes and Radio
 * Groups into it — and it scrolls when it outgrows the panel while the
 * two rules stay put.
 *
 * Escape closes it, a click outside closes it, dragging it toward the
 * edge closes it, focus is trapped inside while it is open and returns
 * to the trigger afterwards, and the page behind it cannot scroll. All
 * of that is Ark's.
 *
 * Nothing animates: the frame draws the sheet at rest and specifies no
 * motion, so none was invented.
 */
const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'FILTERS',
    footer,
    children: (
      <p style={bodySm}>
        Slot. Drop Fields, Checkboxes, Radio Groups — anything from the lower tiers.
      </p>
    ),
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

/** Open on load, which is how the frame draws it. */
export const Default: Story = {
  args: { defaultOpen: true },
}

/** Opened from its own trigger, so focus return is visible on close. */
export const WithTrigger: Story = {
  args: { trigger: <Button tone="secondary">Filters</Button> },
}

/** The slot doing its job: real controls rather than placeholder copy. */
export const WithFields: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        <Field label="Project" placeholder="Any" />
        <Field label="Owner" placeholder="Anyone" />
        <Field label="Tag" placeholder="Any tag" />
      </>
    ),
  },
}

/**
 * More than fits. The slot scrolls and the header and footer hold their
 * place — which is what the two rules are for.
 */
export const Scrolling: Story = {
  args: {
    defaultOpen: true,
    children: (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <Field key={i} label={`Filter ${i + 1}`} placeholder="Any" />
        ))}
      </>
    ),
  },
}

/** A single verb. The row packs to the end whatever is in it. */
export const OneAction: Story = {
  args: {
    defaultOpen: true,
    footer: (
      <Button size="md" tone="primary">
        Done
      </Button>
    ),
  },
}

/**
 * Pinned to the leading edge instead. `swipeDirection` is Ark's and is
 * direction-aware, so the spine, the swipe and the edge move together.
 */
export const LeadingEdge: Story = {
  args: { defaultOpen: true, swipeDirection: 'start' },
}

/**
 * Right-to-left: "end" resolves to the left edge and the spine follows,
 * because both are logical rather than physical. Direction reaches the
 * machine through Ark's locale context, not through a prop on the root.
 */
export const RightToLeft: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <LocaleProvider locale="ar-AE">
      <Drawer {...args} />
    </LocaleProvider>
  ),
}
