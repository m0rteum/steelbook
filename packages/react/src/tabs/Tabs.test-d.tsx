/**
 * Compile-time conformance test: the Figma `Selected` axis is the tabs'
 * `value`, `Interaction` is a skin rather than a prop, and every trigger
 * and panel is keyed by a value.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening any of the props types breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

// Accepted — the drawn default: three tabs, the first one selected.
export const basic = (
  <Tabs defaultValue="overview">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="specs">Specs</Tab>
      <Tab value="reviews">Reviews</Tab>
    </TabList>
    <TabPanel value="overview">Panel content.</TabPanel>
    <TabPanel value="specs">Panel content.</TabPanel>
    <TabPanel value="reviews">Panel content.</TabPanel>
  </Tabs>
)

// Accepted — Interaction=Disabled is the prop Ark forwards to the button.
export const disabled = <Tab value="reviews" disabled>Reviews</Tab>

// Accepted — the strip can name itself; the design draws no label for it.
export const labelledList = <TabList aria-label="Product details" />

// @ts-expect-error — Selected is the tabs' value, not a prop on the trigger.
export const selectedAsProp = <Tab value="specs" selected>Specs</Tab>

// @ts-expect-error — Hover is `:hover`; there is no interaction prop.
export const interactionAsProp = <Tab value="specs" interaction="Hover">Specs</Tab>

// @ts-expect-error — the trigger is a button, and a button with no label has no name.
export const labelless = <Tab value="specs" />

// @ts-expect-error — Ark keys every trigger by value; without one it cannot select.
export const valuelessTab = <Tab>Specs</Tab>

// @ts-expect-error — a panel with no value belongs to no trigger.
export const valuelessPanel = <TabPanel>Panel content.</TabPanel>
