import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingPanel } from './FloatingPanel'

/**
 * Figma: Steelbook Design System › Floating Panel (node `42:522`).
 *
 * The design draws one state, and every other one is reachable from it:
 * drag the panel by its title bar, resize it from the ridged corner,
 * minimize it with the minus and restore it by double-clicking the bar.
 * Arrow keys move the panel once it has focus; the x closes it.
 */
const meta = {
  title: 'Components/FloatingPanel',
  component: FloatingPanel,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'INSPECTOR',
    defaultPosition: { x: 40, y: 40 },
    children: 'Slot. A draggable, resizable tool window — grip to move, corner to resize.',
  },
} satisfies Meta<typeof FloatingPanel>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn panel: 320 × 260, open. */
export const Default: Story = {}
