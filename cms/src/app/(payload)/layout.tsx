/*
 * Payload generated this file, and this project has since taken it over — the font below is
 * loaded here because `RootLayout` owns the `<html>` element and `htmlProps` is the only hook
 * onto it. If `payload generate` ever rewrites this file, the two additions to restore are the
 * `Arimo` import and the `htmlProps` passed to `RootLayout`.
 */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Arimo } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

/*
 * The panel's typeface, self-hosted. `next/font/google` downloads the files at build time and
 * serves them from this app's own origin, so no admin screen depends on a request to Google
 * succeeding — and nothing is disclosed to a third party when a teacher opens the CMS.
 *
 * Three real weights rather than a synthesised bold: Payload's default stack literally names
 * Arial, and with Arial absent a browser synthesises bold from whatever it substitutes, which
 * drops the precomposed Vietnamese marks (ệ, ẫ, ỡ). Arimo ships genuine Vietnamese glyphs at
 * each weight and is metric-compatible with Arial, which is also why the public site uses it.
 */
const arimo = Arimo({
  display: 'swap',
  subsets: ['latin', 'vietnamese'],
  variable: '--ttv-font-arimo',
  weight: ['400', '500', '700'],
})

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ className: arimo.variable }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
