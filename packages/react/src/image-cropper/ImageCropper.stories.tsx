import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageCropper } from './ImageCropper'

/**
 * A stand-in photograph, inline so the stories need no network: a 640 x 480
 * SVG with a horizon and a sun, which makes the pan, the zoom and the
 * quarter turns easy to read.
 */
const PHOTO =
  'data:image/svg+xml;utf8,' +
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">' +
  '<rect width="640" height="480" fill="%23fca5a5"/>' +
  '<rect y="300" width="640" height="180" fill="%23166534"/>' +
  '<circle cx="180" cy="140" r="70" fill="%23fde047"/>' +
  '<path d="M0 300 L200 160 L360 300 Z" fill="%23475569"/>' +
  '<path d="M300 300 L470 180 L640 300 Z" fill="%23334155"/>' +
  '<rect x="24" y="24" width="80" height="80" fill="%23ffffff"/>' +
  '<rect x="536" y="376" width="80" height="80" fill="%23000000"/>' +
  '</svg>'

/**
 * Figma: Steelbook Design System › Image Cropper (node `43:513`).
 *
 * Drag inside the frame to move the crop, drag a corner to resize it, drag
 * the stage to pan the image, and scroll or pinch to zoom. The frame takes
 * the arrow keys once focused — plain to move, Alt to resize, `+` and `-`
 * to zoom, and Shift or Ctrl for bigger steps.
 *
 * The toolbar is not an Ark part. Ark has no triggers for zoom, rotation or
 * export, so the four buttons drive its api directly, and the readout is
 * computed from the live crop rather than copied from the frame — which is
 * why it opens reading `9:7` where the frame's label says `3:2`.
 */
const meta = {
  title: 'Components/ImageCropper',
  component: ImageCropper,
  parameters: { layout: 'centered' },
  args: { onCrop: () => {} },
} satisfies Meta<typeof ImageCropper>

export default meta
type Story = StoryObj<typeof meta>

/** The drawn panel: no image, the placeholder glyph, the drawn crop. */
export const Default: Story = {}

/** With an image under the crop frame. */
export const WithImage: Story = {
  args: { src: PHOTO },
}

/** Locked to 3:2 — resizing a corner keeps the ratio, and the readout says so. */
export const LockedRatio: Story = {
  args: { src: PHOTO, aspectRatio: 3 / 2, initialCrop: { x: 30, y: 35, width: 240, height: 160 } },
}

/** Opened part-way zoomed and a quarter turn round. */
export const Transformed: Story = {
  args: { src: PHOTO, defaultZoom: 1.6, defaultRotation: 90 },
}

/** Fixed: the image still pans and zooms under a crop that cannot move. */
export const FixedCrop: Story = {
  args: { src: PHOTO, fixedCropArea: true },
}

/** Tool names in another language, which is all the toolbar exposes. */
export const Translated: Story = {
  args: {
    src: PHOTO,
    labels: {
      zoomIn: 'Vergrößern',
      zoomOut: 'Verkleinern',
      rotate: 'Nach links drehen',
      crop: 'Zuschneiden',
    },
  },
}

/**
 * The crop button's output, shown as it comes back — the Blob is turned
 * into an object URL and rendered beside the cropper.
 */
export const Cropped: Story = {
  args: { src: PHOTO },
  render: function CroppedStory(args) {
    const [result, setResult] = useState<string | null>(null)

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sb-gap-lg)' }}>
        <ImageCropper
          {...args}
          onCrop={(image) => {
            setResult((previous) => {
              if (previous) URL.revokeObjectURL(previous)
              return URL.createObjectURL(image)
            })
          }}
        />
        <output
          style={{
            display: 'block',
            inlineSize: '200px',
            padding: 'var(--sb-gap-sm)',
            border: 'var(--sb-stroke-default) solid var(--sb-border-default)',
            backgroundColor: 'var(--sb-bg-surface)',
            color: 'var(--sb-text-muted)',
            fontFamily: 'var(--sb-text-mono-sm-family)',
            fontSize: 'var(--sb-text-mono-sm-size)',
          }}
        >
          {result ? (
            <img src={result} alt="The cropped result" style={{ inlineSize: '100%' }} />
          ) : (
            'Press the crop tool'
          )}
        </output>
      </div>
    )
  },
}
