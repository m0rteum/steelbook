/**
 * Compile-time conformance test: the dropzone's `State` axis is Ark's
 * own state or a prop it already has, never a `state` prop, and the
 * rows come from the machine rather than from children.
 *
 * There is nothing to run: `tsc --noEmit` IS the assertion. Each
 * `@ts-expect-error` fails the build if the error it expects stops being
 * raised, so widening FileUploadProps breaks typecheck here.
 *
 * Named `.test-d.tsx` so vitest's default `*.{test,spec}.*` glob skips it.
 */
import { FileUpload } from './FileUpload'

// Accepted — the drawn default.
export const basic = <FileUpload maxFileSize={50 * 1024 * 1024} />

// Accepted — State=Error is Ark's `invalid` plus the copy that names the limit.
export const rejected = (
  <FileUpload
    invalid
    errorHeadline="That file is over 50 MB."
    onFileReject={({ files }) => void files}
  />
)

// Accepted — State=Disabled is the prop.
export const disabled = <FileUpload disabled />

// Accepted — row state is the caller's, since Ark tracks files and not transfers.
export const uploading = (
  <FileUpload
    progress={(file) => (file.size > 0 ? 60 : undefined)}
    isFailed={(file) => file.name.endsWith('.exe')}
  />
)

// @ts-expect-error — Dragover is data-dragging and Error is `invalid`; neither is a state prop.
export const stateAsProp = <FileUpload state="Dragover" />

// @ts-expect-error — the rows come from the accepted files; children are not composed here.
export const withChildren = <FileUpload>extra</FileUpload>
