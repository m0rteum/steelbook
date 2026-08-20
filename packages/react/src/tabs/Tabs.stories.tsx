import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

/**
 * Figma: Steelbook Design System › Tabs (node `30:212`) and Tab
 * (node `30:200`).
 *
 * Selected is the tabs' `value`, Hover is `:hover`, Disabled is the
 * prop. A selected tab stays a solid black block in every interaction —
 * it does not lighten on hover, and it does not grey out.
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
        <Story />
      </div>
    ),
  ],
  args: { defaultValue: 'overview' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn strip — three tabs, the first one selected. */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews">Reviews</Tab>
      </TabList>
      <TabPanel value="overview">
        Panel content. Swap this frame for anything — it is the slot.
      </TabPanel>
      <TabPanel value="specs">Two colors, one accent, a 4px grid.</TabPanel>
      <TabPanel value="reviews">Nobody has said anything yet.</TabPanel>
    </Tabs>
  ),
}

/** Interaction=Disabled — the third tab's label greys out; the fill does not. */
export const Disabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews" disabled>
          Reviews
        </Tab>
      </TabList>
      <TabPanel value="overview">
        Panel content. Swap this frame for anything — it is the slot.
      </TabPanel>
      <TabPanel value="specs">Two colors, one accent, a 4px grid.</TabPanel>
      <TabPanel value="reviews">Unreachable — the tab is disabled.</TabPanel>
    </Tabs>
  ),
}

/** Selected outranks both other skins: this tab is disabled and still black. */
export const SelectedAndDisabled: Story = {
  args: { defaultValue: 'reviews' },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="specs">Specs</Tab>
        <Tab value="reviews" disabled>
          Reviews
        </Tab>
      </TabList>
      <TabPanel value="overview">
        Panel content. Swap this frame for anything — it is the slot.
      </TabPanel>
      <TabPanel value="specs">Two colors, one accent, a 4px grid.</TabPanel>
      <TabPanel value="reviews">Nobody has said anything yet.</TabPanel>
    </Tabs>
  ),
}
