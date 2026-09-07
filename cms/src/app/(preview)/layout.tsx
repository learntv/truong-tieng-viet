import '@ttv/lesson-render/tokens.css'

import { Arimo } from 'next/font/google'
import React from 'react'

import './preview.css'

/**
 * Root layout for the lesson preview, separate from both the admin panel's layout and the Payload
 * template's `(frontend)` one — the preview is neither. It carries the site's typeface and tokens
 * and nothing else: no nav, no chrome, so what an editor sees is the lesson.
 */
const arimo = Arimo({
  display: 'swap',
  subsets: ['latin', 'vietnamese'],
  variable: '--ttv-font-arimo',
  weight: ['400', '500', '700'],
})

const PreviewLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html className={arimo.variable} lang="vi">
    <body>{children}</body>
  </html>
)

export default PreviewLayout
