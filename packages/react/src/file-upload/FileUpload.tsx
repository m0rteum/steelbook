import type { ReactNode } from 'react'
import { FileUpload as ArkFileUpload, type FileUploadRootProps } from '@ark-ui/react/file-upload'
import { FileIcon } from '../icons/FileIcon'
import { UploadIcon } from '../icons/UploadIcon'
import { XIcon } from '../icons/XIcon'
import './FileUpload.css'

export type FileUploadProps = Omit<FileUploadRootProps, 'children'> & {
  /** The dropzone headline at rest. */
  headline?: ReactNode
  /** The headline while a file is over the target. */
  dragHeadline?: ReactNode
  /**
   * The headline once something has been rejected. The drawn copy —
   * "That file is over 50 MB." — names the limit that broke, so it has
   * no default: pass one from `onFileReject` and set `invalid`.
   */
  errorHeadline?: ReactNode
  /** The mono line under the headline, in every state. */
  hint?: ReactNode
  /**
   * The second line of a file row once it has failed. Rows only fail if
   * you say so — Ark tracks accepted files, not transfer state.
   */
  errorStatus?: ReactNode
  /**
   * Per-file upload progress, 0–100. A row with a number shows the bar;
   * a row without one shows its size and reads as done. Ark holds the
   * files, not the transfer, so this is the caller's.
   */
  progress?: (file: File) => number | undefined
  /** Files the caller considers failed. */
  isFailed?: (file: File) => boolean
}

/**
 * A dashed drop target over a list of file rows. Dragover floods
 * orange-subtle; error states the limit it broke.
 *
 * Both Figma components live here. Ark's `Item` needs a `File` from the
 * machine and the dropzone needs the same root, so neither can stand
 * alone — the root renders the target and one row per accepted file,
 * the way PIN Input renders its cells.
 *
 * The Figma `State` axis on the dropzone maps to Ark: Dragover is
 * `data-dragging`, Error is `invalid`, Disabled is `disabled`. The one
 * on the rows is the caller's: Ark tracks which files were accepted, not
 * how far they have transferred, so `progress` and `isFailed` decide
 * whether a row shows a bar, a size, or a failure.
 *
 * Two things worth knowing:
 *
 * - **The dash rhythm is the browser's.** Figma draws an 8/6 dash and
 *   CSS `border-style: dashed` gives no control over the pattern. It is
 *   the closest faithful expression; a `repeating-linear-gradient` border
 *   could match exactly at the cost of four gradients and the corners.
 * - **The error headline has no default.** The drawn copy names a
 *   specific limit, so it is yours to supply alongside `invalid`.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   maxFileSize={50 * 1024 * 1024}
 *   accept={{ 'image/png': ['.png'], 'image/svg+xml': ['.svg'] }}
 *   invalid={!!rejected}
 *   errorHeadline={rejected && `That file is over 50 MB.`}
 *   progress={(file) => uploads[file.name]}
 * />
 * ```
 *
 * Figma: Steelbook Design System › File Dropzone (node `40:22`) and
 * File Item (node `40:48`).
 * Built on [Ark UI FileUpload](https://ark-ui.com/docs/components/file-upload).
 */
export function FileUpload({
  headline = 'Drag files here or browse',
  dragHeadline = 'Drop it.',
  errorHeadline,
  hint = 'PNG · SVG · PDF — MAX 50 MB',
  errorStatus = 'failed — retry?',
  progress,
  isFailed,
  className,
  ...props
}: FileUploadProps) {
  return (
    <ArkFileUpload.Root
      {...props}
      className={className ? `sb-file-upload ${className}` : 'sb-file-upload'}
    >
      <ArkFileUpload.Dropzone className="sb-file-upload__dropzone">
        <span className="sb-file-upload__glyph" aria-hidden="true">
          <UploadIcon />
        </span>
        <ArkFileUpload.Context>
          {(api) => (
            <p className="sb-file-upload__headline">
              {api.dragging ? dragHeadline : (props.invalid && errorHeadline) || headline}
            </p>
          )}
        </ArkFileUpload.Context>
        <p className="sb-file-upload__hint">{hint}</p>
      </ArkFileUpload.Dropzone>

      <ArkFileUpload.ItemGroup className="sb-file-upload__items">
        <ArkFileUpload.Context>
          {(api) =>
            api.acceptedFiles.map((file) => {
              const percent = progress?.(file)
              const failed = isFailed?.(file) ?? false
              return (
                <ArkFileUpload.Item
                  key={`${file.name}-${file.lastModified}`}
                  file={file}
                  className="sb-file-upload__item"
                  data-failed={failed || undefined}
                >
                  <span className="sb-file-upload__file-glyph" aria-hidden="true">
                    <FileIcon />
                  </span>
                  <div className="sb-file-upload__meta">
                    <ArkFileUpload.ItemName className="sb-file-upload__filename" />
                    {failed ? (
                      <p className="sb-file-upload__status">{errorStatus}</p>
                    ) : percent === undefined ? (
                      <ArkFileUpload.ItemSizeText className="sb-file-upload__status" />
                    ) : (
                      <div
                        className="sb-file-upload__progress"
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Uploading ${file.name}`}
                      >
                        <span
                          className="sb-file-upload__progress-fill"
                          style={{ inlineSize: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <ArkFileUpload.ItemDeleteTrigger className="sb-file-upload__remove">
                    <XIcon />
                  </ArkFileUpload.ItemDeleteTrigger>
                </ArkFileUpload.Item>
              )
            })
          }
        </ArkFileUpload.Context>
      </ArkFileUpload.ItemGroup>

      <ArkFileUpload.HiddenInput />
    </ArkFileUpload.Root>
  )
}
