import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from './Accordion'

/**
 * Figma: Steelbook Design System › Accordion (node `31:25`) and
 * Accordion Item (node `31:24`).
 *
 * Expanded is the accordion's `value`, Hover is `:hover`, Disabled is
 * the prop. Ark's defaults are kept: opening a row closes the last one,
 * and the open row cannot be clicked shut.
 */
const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn stack — three questions, the first one open. */
export const Default: Story = {
  args: { defaultValue: ['made-of'] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="made-of" title="What is Steelbook made of?">
        Two colors, one accent, a 4px grid and an unreasonable amount of conviction. Every token
        in this answer is bound — flip the mode and it holds.
      </AccordionItem>
      <AccordionItem value="dark-mode" title="Does it support dark mode?">
        Every semantic token has a dark counterpart. Nothing in a component picks a color itself.
      </AccordionItem>
      <AccordionItem value="corners" title="Can I round the corners?">
        The radius tokens exist and they are all zero. Change them there, not here.
      </AccordionItem>
    </Accordion>
  ),
}

/** Interaction=Disabled — the middle row's ink greys out; the fill does not. */
export const Disabled: Story = {
  args: { defaultValue: ['made-of'] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="made-of" title="What is Steelbook made of?">
        Two colors, one accent, a 4px grid and an unreasonable amount of conviction.
      </AccordionItem>
      <AccordionItem value="dark-mode" title="Does it support dark mode?" disabled>
        Unreachable — the row above is drawn disabled.
      </AccordionItem>
      <AccordionItem value="corners" title="Can I round the corners?">
        The radius tokens exist and they are all zero.
      </AccordionItem>
    </Accordion>
  ),
}

/** More than one answer at a time, and every row closable. Ark's, not drawn. */
export const MultipleAndCollapsible: Story = {
  args: { multiple: true, collapsible: true, defaultValue: ['made-of', 'dark-mode'] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="made-of" title="What is Steelbook made of?">
        Two colors, one accent, a 4px grid and an unreasonable amount of conviction.
      </AccordionItem>
      <AccordionItem value="dark-mode" title="Does it support dark mode?">
        Every semantic token has a dark counterpart.
      </AccordionItem>
      <AccordionItem value="corners" title="Can I round the corners?">
        The radius tokens exist and they are all zero.
      </AccordionItem>
    </Accordion>
  ),
}
