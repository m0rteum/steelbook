/**
 * Compile-time conformance test: the three drawn text properties are
 * required, the stats row takes the shape the drawing describes, the
 * avatar's size stays pinned to the drawn `lg`, and the trigger is the
 * caller's own element.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening HoverCardProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { HoverCard } from './HoverCard'

const stats = [
  { value: 214, label: 'shipped' },
  { value: 12, label: 'systems' },
]

// Accepted — the drawn card, hanging off a link.
export const basic = <HoverCard name="Sasha Brik" handle="@sbrik" bio="Welds design systems." initials="SB" stats={stats}><a href="/u/sbrik">@sbrik</a></HoverCard>

// Accepted — a photo on the disc, forwarded to Avatar.
export const photo = <HoverCard name="Sasha Brik" handle="@sbrik" bio="Welds." stats={stats} src="/sasha.jpg" alt="Sasha Brik"><a href="/u/sbrik">@sbrik</a></HoverCard>

// Accepted — initials are optional; without them Avatar draws its glyph.
export const glyph = <HoverCard name="Sasha Brik" handle="@sbrik" bio="Welds." stats={stats}><a href="/u/sbrik">@sbrik</a></HoverCard>

// Accepted — open is the caller's to control.
export const controlled = <HoverCard name="S" handle="@s" bio="b" stats={stats} open onOpenChange={({ open }) => void open}><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — Hover is what raises the card, never a prop.
export const stateAsProp = <HoverCard name="S" handle="@s" bio="b" stats={stats} state="Hover"><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — Name, Handle and Bio are all drawn; none is optional.
export const nameless = <HoverCard handle="@s" bio="b" stats={stats}><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — the stats row is drawn, so the card cannot be built without it.
export const statless = <HoverCard name="S" handle="@s" bio="b"><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — a stat is a figure and the thing it counts, not a bare string.
export const looseStats = <HoverCard name="S" handle="@s" bio="b" stats={['214 shipped']}><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — the disc is drawn at lg; the size is not the caller's to pick.
export const resizedAvatar = <HoverCard name="S" handle="@s" bio="b" stats={stats} size="sm"><a href="/u/s">@s</a></HoverCard>

// @ts-expect-error — the trigger replaces Ark's button, so it must be one element.
export const textTrigger = <HoverCard name="S" handle="@s" bio="b" stats={stats}>@s</HoverCard>
