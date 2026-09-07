'use client'

import { useEffect } from 'react'

/**
 * Keeps an open fixed-toolbar dropdown pinned to its button while the document scrolls.
 *
 * Payload renders the dropdown into a portal on `document.body`, positions it once on open with
 * `position: absolute` and page coordinates (`rect.top + window.scrollY`), and never touches it
 * again. The fixed toolbar it hangs off, though, is `position: sticky` — so as soon as the lesson
 * scrolls the button stays put and the menu slides away up the page, leaving an open menu floating
 * over unrelated content. That is always wrong, and it got worse with the block previews: a menu
 * this tall drifts out of view after a very short scroll.
 *
 * The fix is to re-anchor the container to the viewport instead: `position: fixed`, and its
 * coordinates recomputed from the button's live rect on every scroll and resize. Scroll is listened
 * for in the capture phase because the admin panel scrolls inner containers, not just the window.
 *
 * This deliberately covers every fixed-toolbar dropdown rather than only the blocks one — they all
 * hang off the same sticky toolbar and all drift the same way. It lives in this feature because
 * this is the feature that made it impossible to ignore; it registers no nodes or commands of its
 * own, and one instance does the work for the whole page (see `activePlugins`).
 */

// The container Payload gives the fixed toolbar's dropdown portals. The inline (selection) toolbar
// uses a different container class and floats with the selection already, so it is left alone.
const CONTAINER_SELECTOR = '.fixed-toolbar__dropdown-items'
const TRIGGER_SELECTOR = '.fixed-toolbar .toolbar-popup__dropdown.active'

// Payload's own offsets, kept so a dropdown sits exactly where it always has, just viewport-relative.
const GAP = 5
const VIEWPORT_MARGIN = 20

/** Every editor on the page mounts this plugin; only the first one arms the observer. */
let activePlugins = 0
let teardown: (() => void) | null = null

const position = (container: HTMLElement): void => {
  // The trigger is whichever fixed-toolbar dropdown button is currently open. Clicking anywhere
  // closes an open dropdown, so in practice there is exactly one; the last is taken in case a
  // nested editor's toolbar leaves a stale `active` behind.
  const triggers = document.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)
  const trigger = triggers[triggers.length - 1]
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const height = container.offsetHeight

  // Below the button, unless that would run off the bottom of the viewport — with `position: fixed`
  // there is no page left to grow into, so a tall menu near the fold flips above its button.
  const below = rect.bottom + GAP
  const flip = below + height > window.innerHeight && rect.top - GAP - height > 0

  container.style.position = 'fixed'
  container.style.top = `${flip ? rect.top - GAP - height : below}px`
  container.style.left = `${Math.min(rect.left - GAP, window.innerWidth - container.offsetWidth - VIEWPORT_MARGIN)}px`
}

const arm = (): (() => void) => {
  const containers = new Set<HTMLElement>()
  let frame: number | null = null

  const reposition = (): void => {
    if (frame !== null) return
    frame = requestAnimationFrame(() => {
      frame = null
      for (const container of containers) {
        if (container.isConnected) position(container)
        else containers.delete(container)
      }
    })
  }

  const track = (node: Node): void => {
    if (!(node instanceof HTMLElement)) return
    const container = node.matches(CONTAINER_SELECTOR)
      ? node
      : node.querySelector<HTMLElement>(CONTAINER_SELECTOR)
    if (!container) return
    containers.add(container)
    // Payload positions the container in its own effect after mount; this runs on the same tick as
    // the insertion, so wait a frame rather than being overwritten by it.
    reposition()
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(track)
      mutation.removedNodes.forEach((node) => {
        if (node instanceof HTMLElement) containers.delete(node)
      })
    }
  })
  // Direct children of `body` only: the portals mount there, and a subtree observer would wake on
  // every keystroke in every editor on the page.
  observer.observe(document.body, { childList: true })

  window.addEventListener('scroll', reposition, { capture: true, passive: true })
  window.addEventListener('resize', reposition, { passive: true })

  return () => {
    observer.disconnect()
    window.removeEventListener('scroll', reposition, { capture: true })
    window.removeEventListener('resize', reposition)
    if (frame !== null) cancelAnimationFrame(frame)
  }
}

export const StickyDropdownPlugin: React.FC = () => {
  useEffect(() => {
    if (activePlugins++ === 0) teardown = arm()

    return () => {
      if (--activePlugins === 0) {
        teardown?.()
        teardown = null
      }
    }
  }, [])

  return null
}
