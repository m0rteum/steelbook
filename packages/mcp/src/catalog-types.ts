/**
 * Shape of `data/catalog.json`. Produced by `scripts/build-catalog.ts`,
 * consumed by `src/server.ts`. Nothing in here is authored by hand.
 */

export interface CatalogProp {
  name: string
  /** Declared TypeScript type, verbatim from the source. */
  type: string
  required: boolean
  description: string
  /** Text of the `@default` JSDoc tag, when the source carries one. */
  default?: string
}

export interface CatalogExport {
  name: string
  kind: 'component' | 'hook' | 'function' | 'const'
  description: string
  examples: string[]
  figmaNodeId?: string
  /** Name of the props type the component's first parameter is annotated with. */
  propsType?: string
  /** Own props declared in the type literal. */
  props?: CatalogProp[]
  /** Base types intersected into the props type (`Omit<ComponentPropsWithRef<'button'>, 'children'>`). */
  extends?: string[]
  /** For `const` exports, the initialiser text. */
  value?: string
}

export interface CatalogTypeAlias {
  name: string
  type: string
  description: string
  props?: CatalogProp[]
}

export interface FigmaProperty {
  type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP' | string
  defaultValue?: unknown
  variantOptions?: string[]
}

/** One component or component set as captured from the Figma file. */
export interface FigmaComponent {
  id: string
  type: 'COMPONENT' | 'COMPONENT_SET'
  name: string
  /** Figma page the component lives on. */
  page: string
  width: number
  height: number
  variantCount: number
  properties: Record<string, FigmaProperty>
  /** The full description, HTML entities decoded. The `CODE:` block inside it is the binding contract. */
  description: string
}

/** An icon component set in Figma. `lineId` is the node of its `line` style, which is what code exports. */
export interface FigmaIcon {
  id: string
  name: string
  lineId: string
  styles: string[]
}

export interface CatalogComponent {
  /** Primary export, e.g. `Button`. */
  name: string
  /** Display name from the Storybook title, e.g. `Toast` for the `Toaster` export. */
  title: string
  /** Directory name, e.g. `button`. */
  slug: string
  module: string
  importPath: string
  summary: string
  figmaNodeId?: string
  figmaUrl?: string
  primitive: { kind: 'ark'; name: string; docs: string } | { kind: 'native' }
  exports: CatalogExport[]
  types: CatalogTypeAlias[]
  css: {
    classes: string[]
    tokens: string[]
    localProperties: string[]
    note?: string
  }
  storybookId?: string
  stories: { name: string; id: string }[]
  figma?: FigmaComponent
  /** Sub-components drawn alongside it in Figma (Accordion Item, Menu Item, Calendar Day…). */
  figmaRelated?: FigmaComponent[]
}

export interface CatalogIcon {
  name: string
  glyph: string
  figmaNodeId?: string
  description: string
  size: number
  viewBox: string
  /** `d` attribute of each path, verbatim from the Figma export. */
  paths: string[]
  /** Complete SVG markup, `currentColor` filled. */
  svg: string
  figma?: FigmaIcon
}

export interface CatalogToken {
  name: string
  /** Value in `:root` (light theme, desktop). */
  value: string
  group: string
  note?: string
  references?: string[]
  dark?: string
  mobile?: string
  resolved?: string
  resolvedDark?: string
  resolvedMobile?: string
  usedBy?: string[]
}

export interface CatalogGuideline {
  id: string
  title: string
  source: 'rules' | 'readme'
  body: string
}

export interface Catalog {
  version: 1
  generatedAt: string
  source: {
    figmaFile: string
    figmaUrl: string
    repository: string
    reactPackage: string
    reactVersion: string
    arkVersion: string
    commit: string
  }
  counts: { components: number; icons: number; tokens: number; tokenDeclarations: number; guidelines: number }
  components: CatalogComponent[]
  icons: CatalogIcon[]
  tokens: CatalogToken[]
  tokensCss: string
  tokensHeader: string
  guidelines: CatalogGuideline[]
  /** Every icon set in the Figma file, exported to code or not. */
  figmaIcons: FigmaIcon[]
}
