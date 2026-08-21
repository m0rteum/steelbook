/**
 * Compile-time conformance test: `Orientation` is not a prop — which bar
 * appears is the machine's reading of the content — and nothing about
 * the scrollbar's own states leaks in either.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ScrollAreaProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { ScrollArea } from './ScrollArea'

// Accepted — the drawn box, sized by the caller.
export const basic = <ScrollArea style={{ blockSize: 200 }}>Content that overflows…</ScrollArea>

// Accepted — anything composes inside it.
export const composed = <ScrollArea style={{ blockSize: 200 }}><ul><li>One</li><li>Two</li></ul></ScrollArea>

// Accepted — native div attributes reach the drawn frame.
export const nativeAttrs = <ScrollArea id="log" data-testid="log" style={{ blockSize: 200 }}>Content</ScrollArea>

// Accepted — direction passes through to the machine, which flips the bar's edge.
export const rtl = <ScrollArea dir="rtl" style={{ blockSize: 200 }}>Content</ScrollArea>

// @ts-expect-error — a viewport with nothing in it has nothing to scroll.
export const empty = <ScrollArea style={{ blockSize: 200 }} />

// @ts-expect-error — Orientation is the machine's, measured from the content.
export const orientationAsProp = <ScrollArea orientation="horizontal" style={{ blockSize: 200 }}>Content</ScrollArea>

// @ts-expect-error — which bars exist is not a choice either.
export const scrollbarsAsProp = <ScrollArea scrollbars="vertical" style={{ blockSize: 200 }}>Content</ScrollArea>

// @ts-expect-error — Hover and Dragging are CSS (data-hover, data-dragging), never props.
export const hoverAsProp = <ScrollArea hover style={{ blockSize: 200 }}>Content</ScrollArea>

// @ts-expect-error — the thumb's size and offset come off the scroll ratio.
export const thumbSizeAsProp = <ScrollArea thumbSize={64} style={{ blockSize: 200 }}>Content</ScrollArea>
