import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { TOAST_TONES, Toaster, createToaster } from './Toast'

const toaster = createToaster({ placement: 'bottom-end', gap: 12 })

const TONES = [
  { label: 'Neutral', type: TOAST_TONES.neutral },
  { label: 'Success', type: TOAST_TONES.success },
  { label: 'Danger', type: TOAST_TONES.danger },
  { label: 'Warning', type: TOAST_TONES.warning },
  { label: 'Info', type: TOAST_TONES.info },
] as const

/**
 * Figma: Steelbook Design System › Toast (node `42:42`).
 *
 * Push a toast with a button and it lands bottom-right. Tone is the
 * toast's `type` — Figma's Danger is Ark's `error`. Placement, stack gap
 * and duration are the store's, not the component's.
 */
const meta = {
  title: 'Components/Toast',
  component: Toaster,
  args: { toaster },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

/** All five tones, with the body line. */
export const Default: Story = {
  render: (args) => (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {TONES.map(({ label, type }) => (
          <Button
            key={label}
            tone="secondary"
            onClick={() =>
              toaster.create({
                type,
                title: 'Draft saved',
                description: 'Your work is safe on this device.',
              })
            }
          >
            {label}
          </Button>
        ))}
      </div>
      <Toaster {...args} />
    </>
  ),
}

/** `Show body`=false — omit the description and the slab is one line. */
export const TitleOnly: Story = {
  render: (args) => (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {TONES.map(({ label, type }) => (
          <Button
            key={label}
            tone="secondary"
            onClick={() => toaster.create({ type, title: 'Draft saved' })}
          >
            {label}
          </Button>
        ))}
      </div>
      <Toaster {...args} />
    </>
  ),
}
