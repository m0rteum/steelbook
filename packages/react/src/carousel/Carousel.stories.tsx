import type { CSSProperties, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageIcon } from '../icons/ImageIcon'
import { Carousel } from './Carousel'

/**
 * The frame's own width. The carousel fills whatever box it is given;
 * 560 is what this file drew it in, so the stories measure against it.
 * The nav blocks hang 20 outside on each side, so the box is padded to
 * keep them on screen.
 */
const stage: CSSProperties = {
  inlineSize: '560px',
  paddingInline: 'var(--sb-space-5)',
}

/**
 * Demo content, not part of the component: the placeholder glyph and the
 * mono caption Figma draws inside each slide. 276 plus the slide's own
 * 2px borders is the drawn 280.
 */
const demoSlide: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  blockSize: '276px',
}

/**
 * The drawn caption sits 16 in from the slide's outer edge; the slide's
 * own 2px stroke is inside that, so the inset here gives it back.
 */
const demoCaption: CSSProperties = {
  position: 'absolute',
  insetInlineStart: 'calc(var(--sb-space-4) - var(--sb-stroke-default))',
  insetBlockEnd: 'calc(var(--sb-space-4) - var(--sb-stroke-default))',
  color: 'var(--sb-text-muted)',
  fontFamily: 'var(--sb-text-mono-sm-family)',
  fontWeight: 'var(--sb-text-mono-sm-weight)',
  fontSize: 'var(--sb-text-mono-sm-size)',
  lineHeight: 'var(--sb-text-mono-sm-line-height)',
  letterSpacing: 'var(--sb-text-mono-sm-tracking)',
}

const glyph: CSSProperties = {
  inlineSize: 'var(--sb-size-icon-sm)',
  blockSize: 'var(--sb-size-icon-sm)',
  color: 'var(--sb-icon-muted)',
}

function DemoSlide({ caption }: { caption: string }) {
  return (
    <div style={demoSlide}>
      <ImageIcon style={glyph} />
      <span style={demoCaption}>{caption}</span>
    </div>
  )
}

/** The five slides the frame counts: five dots, five snap points. */
function demoSlides(total = 5): ReactNode[] {
  return Array.from({ length: total }, (_, index) => (
    <DemoSlide
      key={index}
      caption={`SLIDE ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
    />
  ))
}

/**
 * Figma: Steelbook Design System › Carousel (node `46:591`).
 *
 * A slide viewport with its neighbours peeking through the gutters, two
 * black nav blocks riding the edges, and a row of square indicators
 * below — the current one stretched and filled orange.
 *
 * Drag it, wheel it, click the blocks or the dots, or focus the row and
 * use the arrow keys, Home and End.
 */
const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Carousel>

/**
 * Five slides from the start. Previous has nowhere to go on the first
 * page, so it shows the disabled skin — a state the frame does not draw.
 */
export const Default: Story = {
  render: () => (
    <div style={stage}>
      <Carousel label="Steelbook slides" slides={demoSlides()} />
    </div>
  ),
}

/**
 * The frame's own state: the second of five, both neighbours showing 18
 * of themselves through the gutters, the second dot stretched.
 */
export const AsDrawn: Story = {
  render: () => (
    <div style={stage}>
      <Carousel label="Steelbook slides" slides={demoSlides()} defaultPage={1} />
    </div>
  ),
}

/** Wrapping around, so neither nav block ever disables. */
export const Looping: Story = {
  render: () => (
    <div style={stage}>
      <Carousel label="Steelbook slides" slides={demoSlides()} loop />
    </div>
  ),
}

/**
 * Two at a time. The slide width falls out of the same arithmetic — half
 * of what is left after the gutters, less half the spacing — and six
 * slides make three pages, so three dots.
 */
export const TwoUp: Story = {
  render: () => (
    <div style={stage}>
      <Carousel label="Steelbook slides" slides={demoSlides(6)} slidesPerPage={2} />
    </div>
  ),
}
