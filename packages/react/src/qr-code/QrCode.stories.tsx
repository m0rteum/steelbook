import type { Meta, StoryObj } from '@storybook/react-vite'
import { QrCode } from './QrCode'

/**
 * Figma: Steelbook Design System › QR Code (node `25:114`).
 *
 * The drawn matrix is a stand-in; this generates a real code from
 * `value`. Point a phone at it — it resolves.
 */
const meta = {
  title: 'Components/QrCode',
  component: QrCode,
  args: {
    value: 'https://steelbook.design',
    'aria-label': 'Link to steelbook.design',
  },
} satisfies Meta<typeof QrCode>

export default meta
type Story = StoryObj<typeof meta>

/** As drawn: 125px frame, 2px border, quiet zone, modules in bg/inverse. */
export const Default: Story = {}

/**
 * A longer value needs a denser matrix. The frame is unchanged — the
 * modules scale to fit, which is what "resize freely" asks for.
 */
export const DenserMatrix: Story = {
  args: {
    value: 'https://steelbook.design/components/qr-code?utm_source=storybook&utm_medium=docs',
    'aria-label': 'Link to the QR Code documentation',
  },
}

/** Resized through the size custom property; modules scale with it. */
export const Resized: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
      <QrCode {...args} />
      <QrCode {...args} style={{ '--sb-qr-code-size': '200px' } as React.CSSProperties} />
    </div>
  ),
}
