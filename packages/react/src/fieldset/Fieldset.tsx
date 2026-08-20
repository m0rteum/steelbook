import type { ReactNode } from 'react'
import { Fieldset as ArkFieldset, type FieldsetRootProps } from '@ark-ui/react/fieldset'
import './Fieldset.css'

export type FieldsetProps = Omit<FieldsetRootProps, 'children'> & {
  /**
   * The group title above the rule of Fields. Required — the design
   * groups "related Fields under a legend"; there is no variant without
   * one. Mirrors the Figma Legend text property.
   */
  legend: ReactNode
  /**
   * The sentence under the legend. Mirrors the Figma Hint text property;
   * omit it for a legend-only group.
   */
  hint?: ReactNode
  /** The Fields being grouped. */
  children: ReactNode
}

/**
 * Groups related Fields under a legend with a 3px top rule.
 *
 * Renders a native `<fieldset>`/`<legend>` pair via Ark, so `disabled`
 * disables every Field inside through Ark's fieldset context — each one
 * picks up its own disabled skin; the fieldset draws no skin of its own
 * because the design draws none.
 *
 * The Figma component has no variant axes — legend and hint are text
 * properties, and everything stateful belongs to the Fields inside.
 *
 * @example
 * ```tsx
 * <Fieldset legend="SHIPPING" hint="Where the crate lands. All fields required.">
 *   <Field label="Street address" required />
 *   <Field label="City" required />
 * </Fieldset>
 * ```
 *
 * Figma: Steelbook Design System › Fieldset (node `27:139`).
 * Built on [Ark UI Fieldset](https://ark-ui.com/docs/components/fieldset).
 */
export function Fieldset({ legend, hint, children, className, ...props }: FieldsetProps) {
  return (
    <ArkFieldset.Root
      {...props}
      className={className ? `sb-fieldset ${className}` : 'sb-fieldset'}
    >
      <ArkFieldset.Legend className="sb-fieldset__legend">{legend}</ArkFieldset.Legend>
      {hint != null ? (
        <ArkFieldset.HelperText className="sb-fieldset__hint">{hint}</ArkFieldset.HelperText>
      ) : null}
      {children}
    </ArkFieldset.Root>
  )
}
