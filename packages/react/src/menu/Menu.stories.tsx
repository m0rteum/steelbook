import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { CopyIcon } from '../icons/CopyIcon'
import { DownloadIcon } from '../icons/DownloadIcon'
import { PenIcon } from '../icons/PenIcon'
import { TrashIcon } from '../icons/TrashIcon'
import { Menu, MenuItem, MenuSeparator } from './Menu'

/**
 * Figma: Steelbook Design System › Menu (node `35:28`) and Menu Item
 * (node `35:27`).
 *
 * Click the trigger to open; arrows walk the rows, typing jumps to one,
 * Enter selects and Escape closes. The highlighted row is the one under
 * the pointer or the one the keyboard is on — Figma's `Interaction=Hover`
 * covers both.
 */
const meta = {
  title: 'Components/Menu',
  component: Menu,
  parameters: { layout: 'centered' },
  args: {
    trigger: <Button tone="secondary">Actions</Button>,
    children: (
      <>
        <MenuItem value="rename" icon={<PenIcon />} shortcut="⌘R">
          Rename
        </MenuItem>
        <MenuItem value="duplicate" icon={<CopyIcon />} shortcut="⌘D">
          Duplicate
        </MenuItem>
        <MenuItem value="download" icon={<DownloadIcon />} shortcut="⌘S">
          Download
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete" tone="danger" icon={<TrashIcon />} shortcut="⌫">
          Delete
        </MenuItem>
      </>
    ),
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn menu, opened by its trigger. */
export const Default: Story = {}

/** Held open, so the panel can be measured against the Figma frame. */
export const Open: Story = {
  args: { open: true },
}

/** A disabled row: muted glyph and label, no hover fill, not selectable. */
export const WithDisabledItem: Story = {
  args: {
    open: true,
    children: (
      <>
        <MenuItem value="rename" icon={<PenIcon />} shortcut="⌘R">
          Rename
        </MenuItem>
        <MenuItem value="duplicate" icon={<CopyIcon />} shortcut="⌘D" disabled>
          Duplicate
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete" tone="danger" icon={<TrashIcon />} shortcut="⌫">
          Delete
        </MenuItem>
      </>
    ),
  },
}

/** Neither boolean set: no glyph, no keystroke, just labels. */
export const LabelsOnly: Story = {
  args: {
    open: true,
    children: (
      <>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
        <MenuItem value="delete" tone="danger">
          Delete
        </MenuItem>
      </>
    ),
  },
}

/** A label longer than the 240px panel wraps and grows its row. */
export const LongLabel: Story = {
  args: {
    open: true,
    children: (
      <>
        <MenuItem value="rename" icon={<PenIcon />} shortcut="⌘R">
          Rename this document and every copy of it
        </MenuItem>
        <MenuItem value="duplicate" icon={<CopyIcon />} shortcut="⌘D">
          Duplicate
        </MenuItem>
      </>
    ),
  },
}
