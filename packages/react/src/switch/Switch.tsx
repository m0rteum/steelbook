import type { ReactNode } from 'react'
import { Switch as ArkSwitch, type SwitchRootProps } from '@ark-ui/react/switch'
import './Switch.css'

export type SwitchProps = Omit<SwitchRootProps, 'children'> & {
  /**
   * The label. Required — see `hideLabel` for the icon-only case; there is no
   * variant of this component without an accessible name.
   */
  children: ReactNode
  /**
   * Keep the label in the accessibility tree but take it off screen. Mirrors
   * `showLabel={false}` on the Figma component.
   *
   * The label element still renders: Ark points the control's
   * `aria-labelledby` at it unconditionally, so dropping it would leave a
   * dangling reference and an unnamed switch.
   *
   * @default false
   */
  hideLabel?: boolean
}

/**
 * An instant on/off control. Unlike a checkbox it commits the moment it is
 * flipped, so reach for it only where there is nothing to submit.
 *
 * Square track, square knob — the knob slides, nothing rounds. On is safety
 * orange.
 *
 * The Figma `Interaction` axis is a skin, not an API: Hover, Focus and
 * Disabled are driven by Ark's `data-hover`, `data-focus-visible` and
 * `data-disabled`. Pass `disabled` to reach the disabled skin; the other two
 * belong to the user.
 *
 * @example
 * ```tsx
 * <Switch defaultChecked onCheckedChange={({ checked }) => setDark(checked)}>
 *   Dark mode
 * </Switch>
 *
 * <Switch hideLabel checked={muted} onCheckedChange={toggleMute}>
 *   Mute notifications
 * </Switch>
 * ```
 *
 * Figma: Steelbook Design System › Switch (node `18:94`).
 * Built on [Ark UI Switch](https://ark-ui.com/docs/components/switch).
 */
export function Switch({ children, hideLabel = false, className, ...props }: SwitchProps) {
  return (
    <ArkSwitch.Root {...props} className={className ? `sb-switch ${className}` : 'sb-switch'}>
      <ArkSwitch.Control className="sb-switch__track">
        <ArkSwitch.Thumb className="sb-switch__knob" />
      </ArkSwitch.Control>
      <ArkSwitch.Label
        className={
          hideLabel ? 'sb-switch__label sb-switch__label--hidden' : 'sb-switch__label'
        }
      >
        {children}
      </ArkSwitch.Label>
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  )
}
