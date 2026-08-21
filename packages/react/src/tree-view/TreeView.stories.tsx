import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TreeView, type TreeViewNode } from './TreeView'

/** The tree the frame draws, in the order it draws it. */
const FILES: TreeViewNode[] = [
  {
    value: 'steelbook',
    children: [
      {
        value: 'foundations',
        children: [{ value: 'tokens.json' }, { value: 'type.css' }],
      },
      { value: 'components', children: [{ value: 'Button.tsx' }, { value: 'Field.tsx' }] },
      { value: 'README.md' },
    ],
  },
]

/** A deeper tree, for the keyboard and for the indent. */
const DEEP: TreeViewNode[] = [
  {
    value: 'packages',
    children: [
      {
        value: 'react',
        children: [
          {
            value: 'src',
            children: [
              { value: 'index.ts' },
              { value: 'tree-view', children: [{ value: 'TreeView.tsx' }] },
            ],
          },
          { value: 'package.json' },
        ],
      },
      { value: 'tokens', children: [{ value: 'tokens.css' }] },
    ],
  },
]

/** With a branch nobody may open and a file nobody may pick. */
const WITH_DISABLED: TreeViewNode[] = [
  {
    value: 'src',
    children: [{ value: 'index.ts' }, { value: 'generated.ts', disabled: true }],
  },
  { value: 'node_modules', children: [], disabled: true },
]

/**
 * Figma: Steelbook Design System › Tree View (node `45:42`), with every
 * row drawn by Tree Item (node `45:41`).
 *
 * Click a folder to open it — the same click selects it — and a file to
 * select it. The tree takes the arrow keys once focused: up and down move,
 * right opens, left closes or steps out, Home and End jump to either end,
 * and typing jumps to the next matching name.
 *
 * Tree Item is not a second export. Its annotation calls it a sub-part,
 * and its two axes land where they should: `Type` is Ark's branch-or-leaf
 * distinction, driven by whether a node has children, and `State` is CSS.
 */
const meta = {
  title: 'Components/TreeView',
  component: TreeView,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '292px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>

export default meta
type Story = StoryObj<typeof meta>

/** The frame exactly: two folders open, `components` closed, `tokens.json` selected. */
export const Default: Story = {
  args: {
    label: 'Project files',
    nodes: FILES,
    defaultExpandedValue: ['steelbook', 'foundations'],
    defaultSelectedValue: ['tokens.json'],
  },
}

/** Everything closed — one folder, one twist. */
export const Collapsed: Story = {
  args: { label: 'Project files', nodes: FILES },
}

/** Four levels deep, so the 18px indent compounds. */
export const Deep: Story = {
  args: {
    label: 'Repository',
    nodes: DEEP,
    defaultExpandedValue: ['packages', 'react', 'src', 'tree-view'],
  },
}

/** Several files at once, which Ark extends with Shift and toggles with Ctrl. */
export const MultiSelect: Story = {
  args: {
    label: 'Project files',
    nodes: FILES,
    selectionMode: 'multiple',
    defaultExpandedValue: ['steelbook', 'foundations'],
    defaultSelectedValue: ['tokens.json', 'type.css'],
  },
}

/**
 * Opening and selecting split apart: a click on a folder selects it, and
 * only the twist opens it.
 */
export const SeparateExpand: Story = {
  args: {
    label: 'Project files',
    nodes: FILES,
    expandOnClick: false,
    defaultExpandedValue: ['steelbook'],
  },
}

/** Disabled nodes. Ark steps over them; no disabled ink is drawn. */
export const Disabled: Story = {
  args: {
    label: 'Project files',
    nodes: WITH_DISABLED,
    defaultExpandedValue: ['src'],
  },
}

/** Controlled from outside — the selection is held in React and echoed above. */
export const Controlled: Story = {
  args: { label: 'Project files', nodes: FILES },
  render: function ControlledStory(args) {
    const [selected, setSelected] = useState<string[]>(['type.css'])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sb-gap-sm)' }}>
        <output
          style={{
            color: 'var(--sb-text-secondary)',
            fontFamily: 'var(--sb-text-mono-sm-family)',
            fontSize: 'var(--sb-text-mono-sm-size)',
          }}
        >
          {selected.join(', ') || 'nothing selected'}
        </output>
        <TreeView
          {...args}
          defaultExpandedValue={['steelbook', 'foundations']}
          selectedValue={selected}
          onSelectionChange={({ selectedValue }) => setSelected(selectedValue)}
        />
      </div>
    )
  },
}
