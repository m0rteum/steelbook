import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'

// Design tokens — global, so every story has the --sb-* custom properties.
import '../../tokens/tokens.css'
// Storybook-only canvas skin (background/text follow the active theme).
import './preview.css'

/**
 * The token file's two mode axes, surfaced as toolbar controls:
 *
 * - light/dark — tokens.css keys dark overrides off `[data-theme="dark"]`
 *   on the root element, so the decorator below sets/removes that
 *   attribute on the preview iframe's <html>.
 * - desktop/mobile — the 768px breakpoint lives in a media query inside
 *   tokens.css (its documented source of truth), so plain viewport sizing
 *   is enough: shrink the iframe below 768px and the query does the rest.
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Steelbook color mode (data-theme on the root element)',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    viewport: { value: 'desktop', isRotated: false },
  },
  parameters: {
    viewport: {
      options: {
        desktop: {
          name: 'Desktop (≥768px)',
          styles: { width: '1024px', height: '800px' },
        },
        mobile: {
          name: 'Mobile (<768px)',
          styles: { width: '375px', height: '667px' },
        },
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string
      useEffect(() => {
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }, [theme])
      return <Story />
    },
  ],
}

export default preview
