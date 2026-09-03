/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Arimo } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

// Arimo is metric-compatible with Arial and ships real bold weights with full
// Vietnamese coverage. It is chosen for diacritic safety: when a literal Arial is
// named and not installed, browsers substitute one face for regular text and a
// different one for synthesized bold, and the bold substitute usually lacks
// precomposed marks (ệ, ẫ, ỡ). next/font self-hosts the files, so there is no
// runtime request to Google that can fail.
const arimo = Arimo({
  display: 'swap',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-arimo',
  weight: ['400', '500', '600', '700'],
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

// RootLayout owns the <html> element, so htmlProps is the only way to put
// next/font's generated variable class where custom.scss can read it.
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
