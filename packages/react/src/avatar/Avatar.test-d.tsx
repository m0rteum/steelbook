/**
 * Compile-time conformance test: the Figma `Type` axis is the presence
 * of `initials` (never a prop), sizes are the four drawn diameters,
 * and no state props exist — the chip draws one skin.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening AvatarProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { Avatar } from './Avatar'

// Accepted — Type=Initials at the default sm size.
export const initials = <Avatar initials="SB" />

// Accepted — Type=Icon: no initials, the user glyph is the fallback.
export const glyph = <Avatar size="xl" />

// Accepted — a photo over the fallback; ring and clip stay.
export const photo = <Avatar size="lg" src="https://example.com/gg.jpg" alt="Geoffrey Gunter" initials="GG" />

// @ts-expect-error — sizes are the four drawn diameters, nothing else.
export const badSize = <Avatar size="2xl" initials="SB" />

// @ts-expect-error — Type is the presence of initials, never a prop.
export const typeAsProp = <Avatar type="Icon" />
