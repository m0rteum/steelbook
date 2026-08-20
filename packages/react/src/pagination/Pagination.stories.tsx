import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

/**
 * Figma: Steelbook Design System › Pagination (node `31:207`) and
 * Pagination Item (node `31:206`).
 *
 * Type is the machine's — it decides which cells are pages, which one
 * is current, and where the ellipses fall. Hover is `:hover`, and
 * Disabled is what Ark puts on prev and next at the ends of the range.
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { count: 120, pageSize: 10 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Ark's own elision — one sibling either side of the current page, one
 * cell at each boundary. This is what a caller gets by default.
 */
export const Default: Story = {
  args: { defaultPage: 2 },
}

/**
 * The row exactly as Figma draws it: `‹ 1 2 3 … 12 ›`.
 *
 * The frame is one snapshot of the machine's elision, not a rule about
 * it — that arrangement is `siblingCount={0}` on page 2 of 12. The
 * description says as much: swap counts by editing the numbers.
 */
export const AsDrawn: Story = {
  args: { defaultPage: 2, siblingCount: 0 },
}

/** Page 1 — prev is disabled, which is the drawn Disabled skin on a frame Figma left stateless. */
export const FirstPage: Story = {
  args: { defaultPage: 1 },
}

/** The last page — next is disabled, and the ellipsis moves to the front. */
export const LastPage: Story = {
  args: { defaultPage: 12 },
}

/** Two ellipses, with more cells either side of the current page. */
export const Wide: Story = {
  args: { count: 500, defaultPage: 25, siblingCount: 2 },
}

/** Few enough pages that nothing is elided. */
export const NoEllipsis: Story = {
  args: { count: 40, defaultPage: 2 },
}
