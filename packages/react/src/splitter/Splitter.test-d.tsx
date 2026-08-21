/**
 * Compile-time conformance test: the two panes are named slots, the
 * divider is the component's own, and `Orientation` is the one Figma axis
 * that really is a prop — the state axes never are.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening SplitterProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Splitter } from './Splitter'

// Accepted — the drawn component, horizontal by default.
export const basic = <Splitter start="A" end="B" />

// Accepted — the other drawn variant.
export const vertical = <Splitter orientation="vertical" start="A" end="B" />

// Accepted — the panes take nodes, not just text.
export const nodes = <Splitter start={<nav>tree</nav>} end={<main>editor</main>} />

// Accepted — size constraints for the two panes, in order.
export const constrained = (
  <Splitter start="A" end="B" panes={[{ minSize: 20, collapsible: true }, { maxSize: 70 }]} />
)

// Accepted — the machine's own switches pass through.
export const machineProps = (
  <Splitter
    start="A"
    end="B"
    defaultSize={[30, 70]}
    keyboardResizeBy={10}
    onResize={({ size }) => void size}
    onResizeEnd={({ size }) => void size}
  />
)

// Accepted — native div attributes reach the drawn box.
export const nativeAttrs = <Splitter start="A" end="B" id="editor-split" data-testid="split" />

// @ts-expect-error — the two panes are named slots; nothing composes in as children.
export const withChildren = <Splitter start="A" end="B">extra</Splitter>

// @ts-expect-error — both panes are required; a splitter with one side is not one.
export const onePane = <Splitter start="A" />

// @ts-expect-error — the panel ids are the component's, not the caller's.
export const ownIds = <Splitter start="A" end="B" panes={[{ id: 'left' }, { id: 'right' }]} />

// @ts-expect-error — the frame draws two panes; Ark's N-panel array is not exposed.
export const rawPanels = <Splitter start="A" end="B" panels={[{ id: 'a' }, { id: 'b' }]} />

// @ts-expect-error — hover / focus / dragging are CSS, never a prop.
export const stateProp = <Splitter start="A" end="B" state="dragging" />

// @ts-expect-error — the bar's name is a string, not a node.
export const nodeLabel = <Splitter start="A" end="B" handleLabel={<span>Resize</span>} />
