import {
  RatingGroup as ArkRatingGroup,
  type RatingGroupRootProps,
} from '@ark-ui/react/rating-group'
import { StarIcon } from '../icons/StarIcon'
import './RatingGroup.css'

/**
 * Exactly one of `aria-label` / `aria-labelledby`, enforced at compile time.
 *
 * The Figma component draws five stars and nothing else — no label — so
 * the radiogroup has no visible text and nothing can name it but the
 * caller. Ark names each star itself ("1 star", "2 stars", …).
 */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never }

export type RatingGroupProps = Omit<
  RatingGroupRootProps,
  'children' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName

/**
 * Five stars, zero ambiguity. Filled stars are safety orange, empty are
 * muted gray.
 *
 * The Figma `Value` axis (0–5) is the numeric `value` — data, not a
 * prop axis — and `count` defaults to the five the design draws.
 *
 * Hovering previews: Ark highlights up to the star under the pointer
 * and puts it back on leave, so the orange fill follows the pointer
 * without any state of ours. Focus is not drawn by the design; the
 * focused star takes the house 3px accent ring so keyboard users can
 * see where they are.
 *
 * @example
 * ```tsx
 * <RatingGroup defaultValue={3} aria-label="Rate this release" />
 *
 * <RatingGroup value={average} readOnly aria-label="Average rating" />
 * ```
 *
 * Figma: Steelbook Design System › Rating Group (node `25:68`).
 * Built on [Ark UI RatingGroup](https://ark-ui.com/docs/components/rating-group).
 */
export function RatingGroup({
  className,
  count = 5,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: RatingGroupProps) {
  // role="radiogroup" sits on the control, and Ark points its
  // aria-labelledby at a Label part the design does not draw — so the
  // name has to travel to the control itself.
  const nameProps: { 'aria-label'?: string; 'aria-labelledby'?: string } = {}
  if (ariaLabel != null) nameProps['aria-label'] = ariaLabel
  if (ariaLabelledBy != null) nameProps['aria-labelledby'] = ariaLabelledBy

  return (
    <ArkRatingGroup.Root
      {...props}
      count={count}
      className={className ? `sb-rating-group ${className}` : 'sb-rating-group'}
    >
      <ArkRatingGroup.Control {...nameProps} className="sb-rating-group__control">
        <ArkRatingGroup.Context>
          {(rating) =>
            rating.items.map((index) => (
              <ArkRatingGroup.Item key={index} index={index} className="sb-rating-group__item">
                <StarIcon />
              </ArkRatingGroup.Item>
            ))
          }
        </ArkRatingGroup.Context>
      </ArkRatingGroup.Control>
      <ArkRatingGroup.HiddenInput />
    </ArkRatingGroup.Root>
  )
}
