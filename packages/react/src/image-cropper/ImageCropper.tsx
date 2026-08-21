import {
  ImageCropper as ArkImageCropper,
  type ImageCropperHandlePosition,
  type ImageCropperRootProps,
} from '@ark-ui/react/image-cropper'
import { CropIcon } from '../icons/CropIcon'
import { ImageIcon } from '../icons/ImageIcon'
import { RotateCcwIcon } from '../icons/RotateCcwIcon'
import { ZoomInIcon } from '../icons/ZoomInIcon'
import { ZoomOutIcon } from '../icons/ZoomOutIcon'
import './ImageCropper.css'

/**
 * The four corners the frame draws. Ark offers eight — the four edges as
 * well — but the design draws squares at the corners only, so only the
 * corners are rendered.
 */
const CORNERS: ImageCropperHandlePosition[] = ['nw', 'ne', 'sw', 'se']

/**
 * The crop rectangle the frame is drawn holding: 180 x 140 at (60, 40) in
 * the 300 x 220 stage, which is centred. Ark's own default fills 80% of
 * the viewport, so without this the cropper would open larger than drawn.
 */
const DRAWN_CROP = { x: 60, y: 40, width: 180, height: 140 }

/** Ark's own default wheel step, used by the two zoom buttons unless the caller sets `zoomStep`. */
const DEFAULT_ZOOM_STEP = 0.1

/** A quarter turn counter-clockwise, as the rotate glyph shows. */
const QUARTER_TURN = 90

/**
 * The largest term the readout will print in a ratio. Keeps a freely
 * dragged crop from reading `187:125`.
 */
const MAX_RATIO_TERM = 16

/** Shown in place of a ratio before the viewport has been measured. */
const NO_RATIO = '—'

/** The separator the frame draws between the two readings. */
const READOUT_SEPARATOR = '·'

/** Accessible names for the four icon-only tools. */
export type ImageCropperLabels = {
  zoomIn: string
  zoomOut: string
  rotate: string
  crop: string
}

const DEFAULT_LABELS: ImageCropperLabels = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  rotate: 'Rotate left',
  crop: 'Crop image',
}

/**
 * The crop's aspect ratio as the readout prints it: the closest `p:q` whose
 * denominator is at most {@link MAX_RATIO_TERM}.
 *
 * A crop with no `aspectRatio` set can be dragged to any size at all, and
 * reducing its pixel dimensions by their greatest common divisor would
 * mostly print two coprime three-digit numbers. Rounding to the nearest
 * small denominator prints what a photographer would say — `3:2`, `4:3`,
 * `16:9` — and is exact whenever the crop really is one of them.
 */
function toRatio(width: number, height: number): string {
  if (!(width > 0) || !(height > 0)) return NO_RATIO

  const target = width / height
  let bestNumerator = 1
  let bestDenominator = 1
  let bestError = Infinity

  for (let denominator = 1; denominator <= MAX_RATIO_TERM; denominator++) {
    const numerator = Math.max(1, Math.round(denominator * target))
    const error = Math.abs(numerator / denominator - target)
    if (error < bestError) {
      bestError = error
      bestNumerator = numerator
      bestDenominator = denominator
    }
  }

  return `${bestNumerator}:${bestDenominator}`
}

export type ImageCropperProps = Omit<ImageCropperRootProps, 'children'> & {
  /**
   * The image to crop. Optional: with none, the stage shows the placeholder
   * glyph the frame draws, and the crop frame sits over it exactly as
   * drawn.
   */
  src?: string
  /**
   * Called with the cropped image when the crop tool is pressed, at the
   * source image's natural resolution. Required — the frame draws a crop
   * button, and a crop button that returns nothing is a lie.
   *
   * Not called when there is no image to crop.
   */
  onCrop: (image: Blob) => void
  /** Accessible names for the four tools, for callers not working in English. */
  labels?: Partial<ImageCropperLabels>
  /** Appended after the panel's own class, on the drawn box. */
  className?: string
}

/**
 * An image cropper: a stage holding the image under a rule-of-thirds crop
 * frame with corner handles, over a toolbar of zoom, rotate and crop, and a
 * mono readout of the current zoom and crop ratio.
 *
 * Ark drives the crop maths, dragging, pinch-zoom, the keyboard and the
 * ARIA; the visual design stays as drawn. The toolbar is not an Ark part —
 * Ark supplies no triggers for zoom, rotation or export — so the four
 * buttons are ordinary buttons calling `api.zoomBy`, `api.setRotation` and
 * `api.getCroppedImage` through `ImageCropper.Context`.
 *
 * Six decisions the design did not make:
 *
 * - **The readout is derived, not copied.** The frame draws
 *   `100% · 3:2` over a crop drawn 180 x 140, which is 9:7 — the label and
 *   the geometry disagree, so the label is treated as illustrative and both
 *   readings are computed from the live crop. As drawn, this component
 *   opens reading `100% · 9:7`. Raised in Figma.
 * - **The ratio is rounded, not reduced.** Without an `aspectRatio` the
 *   crop is free, and reducing its pixel size by the greatest common
 *   divisor would print pairs like `187:125`. See {@link toRatio}.
 * - **Rotation goes counter-clockwise by ninety degrees**, which is what
 *   the glyph (`icons/rotate-ccw`) shows. It is applied as
 *   `setRotation((rotation + 270) % 360)` rather than `rotateBy(-90)`
 *   because Ark clamps rotation to 0–360 instead of wrapping it, so
 *   `rotateBy(-90)` from rest clamps straight back to 0 and the button does
 *   nothing.
 * - **The crop frame takes a move cursor.** Ark puts a resize cursor on
 *   every handle but leaves the body of the selection alone, which reads as
 *   though only the corners were draggable. The frame draws no cursors at
 *   all.
 * - **The placeholder is centred in the stage.** In Figma it sits 14px up
 *   and to the left of centre — the instance was drawn 48px square and
 *   exactly centred, then its width was bound to `size/icon-md`, which
 *   shrank it to 20 without moving it. Raised in Figma.
 * - **No hover, active or disabled skin.** None is drawn for the tools, so
 *   none is invented; they take the house focus ring and nothing else.
 *   Zoom and rotate are no-ops at their limits rather than disabled.
 *
 * Ark's `cropShape` passes through with the rest of the machine's props,
 * but the frame draws a rectangle and nothing else: in this version of
 * `@zag-js/image-cropper` the shape changes only Ark's own labelling — it
 * neither rounds the frame nor masks the exported image — so no circular
 * skin is drawn for it here.
 *
 * Every value in the stylesheet is a token except the stage's 300 x 220,
 * the 6px toolbar gap and the 8px handle — all off the scale and bound to
 * nothing in Figma. They are carried as locals on the block, so a caller
 * can resize the stage from CSS, and each is flagged in Figma rather than
 * snapped to a nearby token.
 *
 * @example
 * ```tsx
 * <ImageCropper
 *   src={photo}
 *   aspectRatio={3 / 2}
 *   onCrop={(image) => upload(image)}
 * />
 * ```
 *
 * Figma: Steelbook Design System › Image Cropper (node `43:513`).
 * Built on [Ark UI ImageCropper](https://ark-ui.com/docs/components/image-cropper).
 */
export function ImageCropper({
  src,
  onCrop,
  labels,
  className,
  initialCrop = DRAWN_CROP,
  zoomStep = DEFAULT_ZOOM_STEP,
  ...props
}: ImageCropperProps) {
  const names = { ...DEFAULT_LABELS, ...labels }

  return (
    <ArkImageCropper.Root
      {...props}
      initialCrop={initialCrop}
      zoomStep={zoomStep}
      className={className ? `sb-image-cropper ${className}` : 'sb-image-cropper'}
    >
      <ArkImageCropper.Viewport className="sb-image-cropper__stage">
        {src ? (
          <ArkImageCropper.Image src={src} className="sb-image-cropper__image" />
        ) : (
          <span className="sb-image-cropper__placeholder">
            <ImageIcon className="sb-image-cropper__placeholder-glyph" />
          </span>
        )}

        <ArkImageCropper.Selection className="sb-image-cropper__crop">
          <ArkImageCropper.Grid axis="horizontal" className="sb-image-cropper__grid" />
          <ArkImageCropper.Grid axis="vertical" className="sb-image-cropper__grid" />
          {CORNERS.map((position) => (
            /* Ark straddles each handle across its corner with a 50%
               translate; the frame draws them wholly inside. Ark merges a
               caller's props after its own, so the style lands. The two
               differ by the 2px the border sits in, which is invisible:
               bg/inverse and border/default are the same colour in both
               modes. */
            <ArkImageCropper.Handle
              key={position}
              position={position}
              className="sb-image-cropper__handle"
              style={{ translate: 'none' }}
            />
          ))}
        </ArkImageCropper.Selection>
      </ArkImageCropper.Viewport>

      <ArkImageCropper.Context>
        {(api) => (
          <div className="sb-image-cropper__toolbar">
            <button
              type="button"
              className="sb-image-cropper__tool"
              aria-label={names.zoomIn}
              onClick={() => api.zoomBy(zoomStep)}
            >
              <ZoomInIcon className="sb-image-cropper__glyph" />
            </button>

            <button
              type="button"
              className="sb-image-cropper__tool"
              aria-label={names.zoomOut}
              onClick={() => api.zoomBy(-zoomStep)}
            >
              <ZoomOutIcon className="sb-image-cropper__glyph" />
            </button>

            <button
              type="button"
              className="sb-image-cropper__tool"
              aria-label={names.rotate}
              onClick={() => api.setRotation((api.rotation + 360 - QUARTER_TURN) % 360)}
            >
              <RotateCcwIcon className="sb-image-cropper__glyph" />
            </button>

            <button
              type="button"
              className="sb-image-cropper__tool"
              aria-label={names.crop}
              onClick={async () => {
                const image = await api.getCroppedImage()
                if (image instanceof Blob) onCrop(image)
              }}
            >
              <CropIcon className="sb-image-cropper__glyph" />
            </button>

            {/* Ark marks the root aria-live, so this line is announced as
                it changes; it is the readable form of the description Ark
                already writes there. */}
            <p className="sb-image-cropper__readout">
              {`${Math.round(api.zoom * 100)}% ${READOUT_SEPARATOR} ${toRatio(
                api.crop.width,
                api.crop.height,
              )}`}
            </p>
          </div>
        )}
      </ArkImageCropper.Context>
    </ArkImageCropper.Root>
  )
}
