import { useMemo, type ReactNode } from 'react'
import {
  TreeView as ArkTreeView,
  createTreeCollection,
  type TreeViewRootProps,
} from '@ark-ui/react/tree-view'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { ChevronRightIcon } from '../icons/ChevronRightIcon'
import { FileIcon } from '../icons/FileIcon'
import { FolderIcon } from '../icons/FolderIcon'
import './TreeView.css'

/**
 * Ark builds its collection from a single root node that is never drawn.
 * The value only has to be unique against the caller's own.
 */
const ROOT_VALUE = '__steelbook_tree_root__'

/**
 * One node of the tree. The field names are Ark's own defaults, so the
 * collection needs no accessors configured.
 */
export type TreeViewNode = {
  /** Unique within the tree. Selection and expansion are keyed on it. */
  value: string
  /** The row's text. Falls back to `value`. */
  label?: string
  /**
   * Present — even as an empty array — makes this a branch, drawn with a
   * folder and a twist. Absent makes it a leaf, drawn with a file.
   */
  children?: TreeViewNode[]
  /**
   * Ark marks the row `aria-disabled` and skips it in keyboard
   * navigation. No disabled skin is drawn in Figma, so none is painted —
   * only the cursor changes.
   */
  disabled?: boolean
}

export type TreeViewProps = Omit<
  TreeViewRootProps<TreeViewNode>,
  'children' | 'collection'
> & {
  /** The top level of the tree. Keep it stable across renders. */
  nodes: TreeViewNode[]
  /**
   * The tree's accessible name. Figma draws no label, so nothing is
   * rendered for it — the name goes on Ark's `role="tree"` element, and
   * it is the only channel for one. Defaults to Ark's own "Tree View";
   * wins over `translations.treeLabel` if both are given.
   *
   * Ark also points the tree at a Label element that is never rendered.
   * `mergeProps` ignores a prop passed as `undefined`, but an explicit
   * `null` does clear it, so the dangling reference is removed here
   * rather than tolerated. The name still travels via `aria-label`.
   */
  label?: string
  /** Appended after the component's own class, on the drawn box. */
  className?: string
}

/**
 * A nested file tree: folders that open and close, files that select. Ark
 * drives the expansion, the selection, the keyboard — arrows, typeahead,
 * Home and End — and the ARIA; the visual design stays as drawn.
 *
 * **It is data-driven, not composed.** The other list-shaped components in
 * this system take an `items` array for the same reason: Ark's machine
 * needs a collection to do keyboard navigation and typeahead over, and a
 * tree cannot be assembled from JSX children without one. So the shape of
 * the tree arrives as `nodes` and the rows are rendered from it.
 *
 * **Tree Item is not a second export.** Figma draws it as its own
 * component set, but its annotation says it is a sub-part — "Build as
 * TreeView.Item or TreeView.Branch". Its axes land here as they should:
 * `Type` is Ark's own branch/leaf distinction, driven by whether a node
 * has children; `State` is CSS, as it is everywhere in this system —
 * Hover is `:hover`, Selected is Ark's `data-selected`.
 *
 * Five decisions the design did not make:
 *
 * - **A selected row keeps body/md.** In Figma, Leaf/Selected is the one
 *   variant whose label switches to label/md — semibold at 14 rather than
 *   regular at 16 — so selecting a file would shrink its name. The
 *   description says only that Selected "rides the orange-subtle fill",
 *   which is what ships. Raised in Figma as the first question.
 * - **A selected branch takes the fill too.** Figma draws Selected only
 *   for Leaf, but Ark selects a branch when its row is clicked, the same
 *   click that opens it, so a branch can be selected in ordinary use.
 * - **Indentation nests, as the description asks.** Each level of
 *   children is an indented column, so a row's fill starts at its own
 *   indent rather than at the panel edge — which is what the frame draws
 *   for the selected file.
 * - **Long names clip; they do not wrap or ellipsise.** Figma clips each
 *   row, and the row is a fixed 32 tall, so a name that outruns the panel
 *   is cut. Raised in Figma.
 * - **The panel fills its container.** Figma hugs it to 292, but that is
 *   a 240 row plus its deepest indent plus the padding — the row's label
 *   is set to fill, so in code the rows stretch and the panel takes the
 *   width it is given.
 *
 * Every value in the stylesheet is a token except the 18px indent, the
 * 6px row gap and the 14px slot that stands in for a leaf's twist. All
 * three are off the scale and bound to nothing in Figma; they are carried
 * as locals on the block and flagged rather than snapped.
 *
 * @example
 * ```tsx
 * <TreeView
 *   label="Project files"
 *   nodes={[{ value: 'src', children: [{ value: 'index.ts' }] }]}
 *   defaultExpandedValue={['src']}
 *   onSelectionChange={({ selectedValue }) => open(selectedValue[0])}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Tree View (node `45:42`) and Tree Item
 * (node `45:41`).
 * Built on [Ark UI TreeView](https://ark-ui.com/docs/components/tree-view).
 */
export function TreeView({
  nodes,
  label,
  className,
  translations,
  ...props
}: TreeViewProps) {
  const collection = useMemo(
    () => createTreeCollection<TreeViewNode>({ rootNode: { value: ROOT_VALUE, children: nodes } }),
    [nodes],
  )

  return (
    <ArkTreeView.Root
      {...props}
      collection={collection}
      translations={label ? { ...translations, treeLabel: label } : translations}
      className={className ? `sb-tree-view ${className}` : 'sb-tree-view'}
    >
      <ArkTreeView.Tree
        aria-labelledby={null as unknown as string | undefined}
        className="sb-tree-view__tree"
      >
        {nodes.map((node, index) => renderNode(node, [index]))}
      </ArkTreeView.Tree>
    </ArkTreeView.Root>
  )
}

function renderNode(node: TreeViewNode, indexPath: number[]): ReactNode {
  const text = node.label ?? node.value

  return (
    <ArkTreeView.NodeProvider key={node.value} node={node} indexPath={indexPath}>
      {node.children ? (
        <ArkTreeView.Branch>
          <ArkTreeView.BranchControl className="sb-tree-view__row">
            {/* Figma swaps the instance rather than turning one glyph, so
                both are rendered and the stylesheet picks one off Ark's
                data-state — the same way Accordion does it. */}
            <ArkTreeView.BranchIndicator className="sb-tree-view__twist">
              <ChevronRightIcon className="sb-tree-view__chevron--closed" />
              <ChevronDownIcon className="sb-tree-view__chevron--open" />
            </ArkTreeView.BranchIndicator>
            <FolderIcon className="sb-tree-view__glyph" />
            <ArkTreeView.BranchText className="sb-tree-view__label">{text}</ArkTreeView.BranchText>
          </ArkTreeView.BranchControl>

          <ArkTreeView.BranchContent className="sb-tree-view__group">
            {node.children.map((child, index) => renderNode(child, [...indexPath, index]))}
          </ArkTreeView.BranchContent>
        </ArkTreeView.Branch>
      ) : (
        <ArkTreeView.Item className="sb-tree-view__row">
          {/* The frame calls this the indent-slot: an empty box where a
              branch keeps its twist, so a file lines up under its
              folder. */}
          <span className="sb-tree-view__slot" aria-hidden="true" />
          <FileIcon className="sb-tree-view__glyph" />
          <ArkTreeView.ItemText className="sb-tree-view__label">{text}</ArkTreeView.ItemText>
        </ArkTreeView.Item>
      )}
    </ArkTreeView.NodeProvider>
  )
}
