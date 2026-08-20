import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileUpload } from './FileUpload'

/**
 * Figma: Steelbook Design System › File Dropzone (node `40:22`) and
 * File Item (node `40:48`).
 *
 * Click or drop onto the target to add rows. Dragover is Ark's own
 * `data-dragging`; Error is `invalid` plus the copy that names the
 * limit; the rows' states are the caller's, since Ark tracks which files
 * were accepted rather than how far they have transferred.
 */
const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
  args: { maxFileSize: 50 * 1024 * 1024 },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

/** State=Default — the dashed target at rest. */
export const Default: Story = {}

/** State=Error — `invalid` plus the headline that names the limit it broke. */
export const Error: Story = {
  args: { invalid: true, errorHeadline: 'That file is over 50 MB.' },
}

/** State=Disabled — target, glyph and both lines grey out together. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Rows with a bar, a size and a failure — drop three files to see all three. */
export const Rows: Story = {
  args: {
    progress: (file) => (file.name.startsWith('a') ? 60 : undefined),
    isFailed: (file) => file.name.startsWith('z'),
  },
}
