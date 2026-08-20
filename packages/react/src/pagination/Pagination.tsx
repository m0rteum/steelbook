import {
  Pagination as ArkPagination,
  type PaginationRootProps,
} from '@ark-ui/react/pagination'
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon'
import { ChevronRightIcon } from '../icons/ChevronRightIcon'
import { DotsHorizontalIcon } from '../icons/DotsHorizontalIcon'
import './Pagination.css'

export type PaginationProps = Omit<PaginationRootProps, 'children'>

/**
 * Prev, page cells, ellipsis, next — 40px blocks 8px apart, the current
 * page a solid black one with mono digits.
 *
 * Both Figma components live here. The `Type` axis on Pagination Item —
 * Page, Current, Ellipsis — is not a choice a caller makes: the machine
 * decides which cells are pages, which one is current, and where the
 * ellipses fall, from `count`, `pageSize`, `siblingCount` and
 * `boundaryCount`. A separately mountable item would have nothing to
 * decide, so the root renders the whole row, the way File Upload renders
 * its own file rows.
 *
 * `Interaction` is a skin: Hover is `:hover`, Disabled is the native
 * attribute Ark puts on the prev and next buttons at the ends of the
 * range. Current outranks both — Figma draws no hovered current page,
 * and a black block that greys out under the pointer would be worse
 * than one that does not move.
 *
 * Two skins are extended rather than drawn. Prev and next are frames in
 * Figma with no states of their own, but Ark disables them on the first
 * and last page, so they take Pagination Item's own Hover and Disabled
 * skins — same 40px cell, same border, same fills.
 *
 * Figma draws no Focus state. Every cell is a button, so each takes the
 * house ring, inset — the drawn border is already 2px black, and an
 * outside ring would read as a second frame around it.
 *
 * @example
 * ```tsx
 * <Pagination count={120} pageSize={10} defaultPage={2} onPageChange={({ page }) => load(page)} />
 * ```
 *
 * Figma: Steelbook Design System › Pagination (node `31:207`) and
 * Pagination Item (node `31:206`).
 * Built on [Ark UI Pagination](https://ark-ui.com/docs/components/pagination).
 */
export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <ArkPagination.Root
      {...props}
      className={className ? `sb-pagination ${className}` : 'sb-pagination'}
    >
      {/* Ark names both triggers and every item from its own translations. */}
      <ArkPagination.PrevTrigger className="sb-pagination__cell">
        <ChevronLeftIcon />
      </ArkPagination.PrevTrigger>

      <ArkPagination.Context>
        {(api) =>
          api.pages.map((page, index) =>
            page.type === 'page' ? (
              <ArkPagination.Item key={page.value} {...page} className="sb-pagination__cell">
                {page.value}
              </ArkPagination.Item>
            ) : (
              <ArkPagination.Ellipsis
                key={`ellipsis-${index}`}
                index={index}
                className="sb-pagination__cell sb-pagination__cell--ellipsis"
              >
                <DotsHorizontalIcon />
              </ArkPagination.Ellipsis>
            ),
          )
        }
      </ArkPagination.Context>

      <ArkPagination.NextTrigger className="sb-pagination__cell">
        <ChevronRightIcon />
      </ArkPagination.NextTrigger>
    </ArkPagination.Root>
  )
}
