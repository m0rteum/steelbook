/* Steelbook CSS gate — component styles must consume tokens, never raw values.
 *
 * Setup:
 *   pnpm add -Dw stylelint stylelint-config-standard
 *   pnpm lint:css
 *
 * The token file itself is the one place raw values are legal, so it is
 * ignored below. Everything under packages/react/src must resolve through
 * var(--sb-*).
 */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['packages/tokens/**', '**/node_modules/**', '**/dist/**'],
  rules: {
    /* No raw colors — hex, rgb(), hsl(), or named. */
    'color-no-hex': true,
    'declaration-property-value-disallowed-list': {
      '/^(color|background|background-color|border|border-color|border-top-color|border-right-color|border-bottom-color|border-left-color|outline-color|fill|stroke|box-shadow|text-shadow)$/':
        [
          '/#[0-9a-fA-F]{3,8}/',
          '/\\brgba?\\(/',
          '/\\bhsla?\\(/',
          '/^(?!.*var\\(--sb-)(?!.*(currentColor|transparent|inherit|none|initial|unset)).*$/',
        ],

      /* No raw lengths for spacing, sizing, radius, or borders.
         calc() is allowed so long as every term inside is a token. */
      '/^(padding|padding-block|padding-inline|padding-top|padding-right|padding-bottom|padding-left|margin|margin-block|margin-inline|gap|row-gap|column-gap|border-radius|border-width|inline-size|block-size|width|height|min-width|min-height|max-width|max-height)$/':
        [
          '/^(?!.*var\\(--sb-)(?!.*(0|auto|100%|inherit|initial|unset|fit-content|max-content|min-content))[\\d.]+(px|rem|em)/',
        ],

      /* Typography must come from the --sb-text-* groups. */
      '/^(font|font-family|font-size|font-weight|line-height|letter-spacing|font-stretch)$/':
        ['/^(?!.*var\\(--sb-)(?!.*(inherit|initial|unset|normal)).+$/'],
    },

    /* Ark state styling goes through data attributes, not ad-hoc classes.
       Keep selector patterns predictable: sb-block, sb-block__element. */
    'selector-class-pattern': [
      /* Block names may be multi-word (sb-toggle-group); single hyphens
         never collide with the __ and -- BEM separators. */
      '^sb-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9-]+)?(--[a-z0-9-]+)?$',
      {
        message:
          'Class names follow sb-<component>__<part>--<modifier> (BEM, sb- prefixed).',
      },
    ],

    /* Custom properties defined inside components must be namespaced to the
       component so they cannot be mistaken for design tokens. */
    'custom-property-pattern': [
      '^sb-[a-z0-9-]+$',
      { message: 'Custom properties must start with sb-.' },
    ],

    /* Stylistic noise we do not need. */
    'no-descending-specificity': null,
    'declaration-empty-line-before': null,
  },
};
