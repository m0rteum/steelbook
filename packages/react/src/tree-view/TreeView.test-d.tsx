/**
 * Compile-time conformance test: the tree arrives as data, a node is a
 * branch or a leaf by whether it has children, and Tree Item's two Figma
 * axes stay out of the API — `Type` is Ark's branch/leaf distinction and
 * `State` is CSS.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening TreeViewProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { TreeView, type TreeViewNode } from './TreeView'

const nodes: TreeViewNode[] = [
  { value: 'steelbook', children: [{ value: 'tokens.json' }, { value: 'type.css' }] },
  { value: 'README.md' },
]

// Accepted — the drawn tree.
export const basic = <TreeView nodes={nodes} />

// Accepted — an accessible name for Ark's role="tree" element.
export const named = <TreeView nodes={nodes} label="Project files" />

// Accepted — a label distinct from the value.
export const labelled = <TreeView nodes={[{ value: 'a1', label: 'tokens.json' }]} />

// Accepted — an empty branch is still a branch: children present, none in it.
export const emptyBranch = <TreeView nodes={[{ value: 'empty', children: [] }]} />

// Accepted — the machine's own switches pass through.
export const machineProps = (
  <TreeView
    nodes={nodes}
    selectionMode="multiple"
    expandOnClick={false}
    defaultExpandedValue={['steelbook']}
    defaultSelectedValue={['README.md']}
    onSelectionChange={({ selectedValue }) => void selectedValue}
    onExpandedChange={({ expandedValue }) => void expandedValue}
  />
)

// Accepted — native div attributes reach the drawn panel.
export const nativeAttrs = <TreeView nodes={nodes} id="files" data-testid="tree" />

// @ts-expect-error — the tree is fully drawn from its data; nothing composes into it.
export const withChildren = <TreeView nodes={nodes}>extra</TreeView>

// @ts-expect-error — the data is required; a tree with no nodes is not one.
export const noNodes = <TreeView label="Files" />

// @ts-expect-error — the collection is built from `nodes`, not handed in.
export const ownCollection = <TreeView nodes={nodes} collection={{}} />

// @ts-expect-error — branch versus leaf comes from the data, never a prop.
export const typeProp = <TreeView nodes={[{ value: 'a', type: 'branch' }]} />

// @ts-expect-error — hover and selected are CSS, never a prop.
export const stateProp = <TreeView nodes={nodes} state="selected" />

// @ts-expect-error — a node's label is a string; the row is not a slot.
export const nodeLabel = <TreeView nodes={[{ value: 'a', label: <span>a</span> }]} />
