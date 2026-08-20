import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../icons/ArrowRightIcon'

/**
 * Figma: Steelbook Design System › Button (node `14:2`).
 *
 * The component set's variant axes are Size (sm|md|lg) × Tone
 * (primary|secondary|outline|ghost|danger) × State. State is an
 * interaction skin — :hover / :active / :focus-visible / :disabled —
 * so only Disabled appears as a story; the rest are driven by the user.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
  // size is stated explicitly rather than left to the implementation
  // default: the JSDoc documents `md` as the Figma default variant, but
  // the implementation currently falls back to `sm` — flagged upstream.
  args: { children: 'Button', size: 'md', tone: 'primary' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Default variant of the Figma component set: md / primary. */
export const Playground: Story = {}

/** Tone axis — all five tones at the default size. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Button {...args} tone="primary">Primary</Button>
      <Button {...args} tone="secondary">Secondary</Button>
      <Button {...args} tone="outline">Outline</Button>
      <Button {...args} tone="ghost">Ghost</Button>
      <Button {...args} tone="danger">Danger</Button>
    </div>
  ),
}

/** Size axis — sm 32 / md 40 / lg 48. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

/**
 * The `icon-left` / `icon-right` instance-swap slots, shown with their
 * default Figma instances (arrow-left / arrow-right). Slots are
 * decorative (`aria-hidden`); the label carries the meaning.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Button {...args} iconLeft={<ArrowLeftIcon />}>Back</Button>
      <Button {...args} iconRight={<ArrowRightIcon />}>Next</Button>
      <Button {...args} iconLeft={<ArrowLeftIcon />} iconRight={<ArrowRightIcon />}>
        Both slots
      </Button>
    </div>
  ),
}

/** State=Disabled — the one State variant that is an attribute, not a skin. */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Button {...args} tone="primary" disabled>Primary</Button>
      <Button {...args} tone="secondary" disabled>Secondary</Button>
      <Button {...args} tone="outline" disabled>Outline</Button>
      <Button {...args} tone="ghost" disabled>Ghost</Button>
      <Button {...args} tone="danger" disabled>Danger</Button>
    </div>
  ),
}
