import type { Meta, StoryObj } from '@storybook/react-vite'
import { SignaturePad } from './SignaturePad'

/**
 * Figma: Steelbook Design System › Signature Pad (node `44:26`).
 *
 * Draw on the pad with the mouse — the prompt clears, the note swaps to
 * the signed one, and Clear puts it back. The ink keeps flat caps, which
 * is the point of the component.
 */
const meta = {
  title: 'Components/SignaturePad',
  component: SignaturePad,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: { label: 'Signature', signedHint: 'Signed — 18 AUG 2026' },
} satisfies Meta<typeof SignaturePad>

export default meta
type Story = StoryObj<typeof meta>

/** State=Empty — the prompt over the baseline, and the drawing note. */
export const Empty: Story = {}

/** State=Disabled is not drawn; carried from house tokens so Ark's flag is not silent. */
export const Disabled: Story = {
  args: { disabled: true },
}
