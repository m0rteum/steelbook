import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar'
import { UserIcon } from '../icons/UserIcon'
import './Avatar.css'

/** Disc diameter: sm 24 / md 32 / lg 40 / xl 56. */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = Omit<AvatarRootProps, 'children'> & {
  /** @default 'sm' — the default variant of the Figma component set. */
  size?: AvatarSize
  /**
   * Black uppercase initials on the disc. Mirrors the Figma Initials
   * text property (Type=Initials). Omit them for the user-glyph
   * fallback (Type=Icon).
   */
  initials?: string
  /**
   * Photo source. "For photos, drop an image fill on the instance; the
   * ring and clip stay" — the image covers the disc inside the ring,
   * and the initials/glyph fallback shows until it loads (or if it
   * fails).
   */
  src?: string
  /** Accessible name for the photo. Required whenever `src` is given. */
  alt?: string
}

/**
 * Identity chip. Orange disc, black ring, black uppercase initials —
 * or the user glyph as fallback.
 *
 * The Figma `Type` axis is the presence of `initials`: with them the
 * disc reads Type=Initials, without them the `icon/user` glyph renders
 * (Type=Icon). A `src` layers a photo over either fallback via Ark's
 * load tracking. No state axes exist — the chip draws one skin.
 *
 * The initials are hand-placed type in the design (no bound text
 * style): Archivo Bold, wdth 100, sizes 10/12/14/20. Three of those
 * ride the primitive font-size scale; 10px has no token behind it and
 * is flagged as a local value in the CSS.
 *
 * @example
 * ```tsx
 * <Avatar initials="SB" />
 * <Avatar size="xl" />                          // user-glyph fallback
 * <Avatar size="lg" src={user.photoUrl} alt={user.name} initials="GG" />
 * ```
 *
 * Figma: Steelbook Design System › Avatar (node `20:22`).
 * Built on [Ark UI Avatar](https://ark-ui.com/docs/components/avatar).
 */
export function Avatar({ size = 'sm', initials, src, alt, className, ...props }: AvatarProps) {
  const classes = ['sb-avatar', `sb-avatar--${size}`]
  if (className) classes.push(className)

  return (
    <ArkAvatar.Root {...props} className={classes.join(' ')}>
      <ArkAvatar.Fallback className="sb-avatar__fallback">
        {initials ?? (
          <span className="sb-avatar__glyph">
            <UserIcon />
          </span>
        )}
      </ArkAvatar.Fallback>
      {src != null ? <ArkAvatar.Image className="sb-avatar__image" src={src} alt={alt} /> : null}
    </ArkAvatar.Root>
  )
}
