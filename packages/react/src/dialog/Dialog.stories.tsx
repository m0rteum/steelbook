import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { Dialog } from './Dialog'

/**
 * Figma: Steelbook Design System › Dialog (node `41:46`), with the
 * overlay from Example / Dialog on overlay (node `41:47`).
 *
 * Figma's `Tone` axis is not a prop. The two variants differ in exactly
 * one place — the confirming button is `primary` in Default and
 * `danger` in Danger — and since the buttons are a slot, Tone is which
 * Button you put there.
 *
 * Escape closes it, a click outside closes it, focus is trapped inside
 * while it is open and returns to the trigger afterwards, and the page
 * behind it cannot scroll. All of that is Ark's.
 */
const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/** Tone=Default — a primary verb on the confirming side. */
export const Default: Story = {
  args: {
    trigger: <Button tone="secondary">Publish…</Button>,
    title: 'PUBLISH THIS VERSION?',
    body: 'Everyone with the link sees the new version immediately. The old version stays in history.',
    children: (
      <>
        <Button size="md" tone="ghost">Cancel</Button>
        <Button size="md" tone="primary">Publish</Button>
      </>
    ),
  },
}

/**
 * Tone=Danger — the same card, a danger verb, and the consequence named
 * in the body. `role="alertdialog"` goes with it: it is the role for a
 * destructive confirmation, and it also lands initial focus on the
 * close glyph rather than the first action.
 */
export const Danger: Story = {
  args: {
    trigger: <Button tone="danger">Delete files…</Button>,
    role: 'alertdialog',
    title: 'DELETE 214 FILES?',
    body: 'This empties the whole export folder. There is no trash, no undo, no second chance.',
    children: (
      <>
        <Button size="md" tone="ghost">Cancel</Button>
        <Button size="md" tone="danger">Delete forever</Button>
      </>
    ),
  },
}

/** Open on load, which is how the frame draws it. */
export const Open: Story = {
  args: { ...Default.args, defaultOpen: true, trigger: undefined },
}

/** The Danger card, open, as drawn. */
export const DangerOpen: Story = {
  args: { ...Danger.args, defaultOpen: true, trigger: undefined },
}

/**
 * A one-line title, which is the shorter of the two drawn cards. The
 * card hugs its content, so it comes out at the drawn 205 rather than
 * the 242 a two-line title gives.
 */
export const ShortTitle: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
    trigger: undefined,
    title: 'DISCARD DRAFT?',
    body: 'The draft is removed and the published version stays as it is.',
  },
}

/**
 * A single verb. The row packs to the end, so one button sits at the
 * right exactly where two would end.
 */
export const OneAction: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
    trigger: undefined,
    title: 'EXPORT STARTED',
    body: 'You will get a notification when the archive is ready to download.',
    children: <Button size="md" tone="primary">Got it</Button>,
  },
}

/**
 * Long copy in both slots. The card stays at 440 and grows downward;
 * the close glyph holds its place at the top of the wrapping title.
 */
export const LongCopy: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
    trigger: undefined,
    title: 'REPLACE EVERY LINKED COMPONENT IN THIS FILE?',
    body: 'Each instance is relinked to the new library and any local override is dropped. Instances that were detached stay detached. This runs across all pages and cannot be undone from history.',
  },
}
