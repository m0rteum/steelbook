/**
 * Compile-time conformance test: the panel draws itself, so there is
 * nothing to compose into it; a crop button that returns nothing is a lie,
 * so `onCrop` is required; and the drawn state axes stay out of the API.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening ImageCropperProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { ImageCropper } from './ImageCropper'

const onCrop = (image: Blob) => void image

// Accepted — the drawn panel, showing its placeholder.
export const basic = <ImageCropper onCrop={onCrop} />

// Accepted — an image to crop.
export const withImage = <ImageCropper src="/photo.jpg" onCrop={onCrop} />

// Accepted — the crop can be locked to a ratio.
export const locked = <ImageCropper src="/photo.jpg" aspectRatio={3 / 2} onCrop={onCrop} />

// Accepted — the machine's own switches pass through.
export const machineProps = (
  <ImageCropper
    onCrop={onCrop}
    fixedCropArea
    cropShape="circle"
    minZoom={1}
    maxZoom={8}
    zoomStep={0.25}
    defaultRotation={90}
    onCropChange={({ crop }) => void crop}
  />
)

// Accepted — the four tool names are translatable, one at a time.
export const partialLabels = <ImageCropper onCrop={onCrop} labels={{ crop: 'Zuschneiden' }} />

// Accepted — native div attributes reach the drawn panel.
export const nativeAttrs = <ImageCropper onCrop={onCrop} id="avatar-cropper" data-testid="cropper" />

// @ts-expect-error — the panel is fully drawn; nothing composes into it.
export const withChildren = <ImageCropper onCrop={onCrop}>extra</ImageCropper>

// @ts-expect-error — the frame draws a crop button, so a crop handler is required.
export const noHandler = <ImageCropper src="/photo.jpg" />

// @ts-expect-error — the crop arrives as a Blob, not a data URL string.
export const stringCrop = <ImageCropper onCrop={(image: string) => void image} />

// @ts-expect-error — hover / focus / active are CSS, never a prop.
export const stateProp = <ImageCropper onCrop={onCrop} state="hover" />

// @ts-expect-error — the tools are the four drawn ones; the set is not composable.
export const extraTool = <ImageCropper onCrop={onCrop} tools={['flip']} />

// @ts-expect-error — labels name the tools; they are strings, not nodes.
export const nodeLabel = <ImageCropper onCrop={onCrop} labels={{ crop: <span>Crop</span> }} />
