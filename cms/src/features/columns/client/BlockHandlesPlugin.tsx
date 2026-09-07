'use client'

import type { LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical'

import { ENABLE_SLASH_MENU_COMMAND } from '@payloadcms/richtext-lexical/client'
import {
  $createParagraphNode,
  $getNodeByKey,
  $isElementNode,
  $isParagraphNode,
} from '@payloadcms/richtext-lexical/lexical'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { DropContainer, DropTarget } from './dropTargets'

import { $isColumnsNode } from '../nodes/ColumnsNode'
import { collectDropContainers, findDropTarget } from './dropTargets'

/**
 * The block handles — the ⠿ you grab and the + you click — rewritten to understand columns.
 *
 * This replaces Payload's `DraggableBlockPlugin` and `AddBlockHandlePlugin` wholesale (the
 * FreeText editor turns both off via `admin.hideDraggableBlockElement` /
 * `admin.hideAddBlockButton`). Extending them wasn't an option: both resolve the block under
 * the cursor through `root.getChildrenKeys()`, so nothing inside a column is reachable, and
 * both register their drag listeners on `document`, so leaving them on alongside this would
 * mean two handlers racing to move the same node on one drop.
 *
 * Everything above the hit-testing lives in ./dropTargets.ts; this file is the interaction.
 */

const DRAG_FORMAT = 'application/x-kmd-columns-drag'
const HANDLE_CLASS = 'kmd-block-handle'
const HANDLE_WIDTH = 18
const HANDLE_GAP = 4
/** How far outside the editor the pointer may stray before the handles give up and hide. */
const HOVER_BUFFER = 32

type HoverState = {
  container: DropContainer
  key: NodeKey
  rect: DOMRect
}

const isOnHandle = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && target.closest(`.${HANDLE_CLASS}`) !== null

const hide = (elem: HTMLElement | null): void => {
  if (!elem) return
  elem.style.opacity = '0'
  elem.style.transform = 'translate(-10000px, -10000px)'
}

/**
 * Whether the key names a row. Rows are the one thing that can't be dropped into a column, and
 * knowing it up front is what lets the whole drag behave differently (see `allowColumns`).
 */
const isRowKey = (editor: LexicalEditor, key: NodeKey): boolean =>
  editor.getEditorState().read(() => $isColumnsNode($getNodeByKey(key)))

export const BlockHandlesPlugin: React.FC<{ anchorElem: HTMLElement }> = ({ anchorElem }) => {
  const [editor] = useLexicalComposerContext()

  const dragHandleRef = useRef<HTMLButtonElement | null>(null)
  const addHandleRef = useRef<HTMLButtonElement | null>(null)
  const lineRef = useRef<HTMLDivElement | null>(null)

  const [hovered, setHovered] = useState<HoverState | null>(null)

  // Drag state is refs, not state: it is read inside DOM listeners that fire dozens of times a
  // second, and re-rendering on each one would drop frames for no visible benefit.
  const draggedKeyRef = useRef<NodeKey | null>(null)
  const draggedIsRowRef = useRef(false)
  const dropRef = useRef<DropTarget | null>(null)

  /* ----------------------------------------------------------------- hovering */

  useEffect(() => {
    // Resolving the block under the cursor means measuring every block in the document, and
    // `mousemove` fires far faster than the answer can change. Two guards keep that off the
    // main thread: a movement threshold, and at most one measurement per animation frame.
    let frame = 0
    let lastX = -1
    let lastY = -1

    const onMouseMove = (event: MouseEvent) => {
      if (draggedKeyRef.current) return
      // Moving onto a handle must not re-target: the handle sits in the gutter beside the block
      // it belongs to, and re-running the hit test there would make it flicker away as you reach
      // for it.
      if (isOnHandle(event.target)) return

      const rootElem = editor.getRootElement()
      if (!rootElem) return
      const rootRect = rootElem.getBoundingClientRect()
      const outside =
        event.clientX < rootRect.left - HOVER_BUFFER ||
        event.clientX > rootRect.right + HOVER_BUFFER ||
        event.clientY < rootRect.top - HOVER_BUFFER ||
        event.clientY > rootRect.bottom + HOVER_BUFFER

      if (outside) {
        setHovered(null)
        return
      }

      if (Math.abs(event.clientX - lastX) < 3 && Math.abs(event.clientY - lastY) < 3) return
      const { clientX, clientY } = event
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        lastX = clientX
        lastY = clientY

        const target = findDropTarget(collectDropContainers(editor), clientX, clientY, {
          allowColumns: true,
          fuzzy: false,
        })

        if (!target) return
        setHovered((current) =>
          current?.key === target.slot.key && current.rect.top === target.slot.rect.top
            ? current
            : { container: target.container, key: target.slot.key, rect: target.slot.rect },
        )
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [editor])

  // Position both handles in the gutter of whichever container the hovered block lives in. One
  // formula covers both cases because it is anchored to the block's own left edge: at the top
  // level that is the editor's 3rem gutter, inside a column it is the column's narrower one.
  useEffect(() => {
    const anchorRect = anchorElem.getBoundingClientRect()

    if (!hovered) {
      hide(dragHandleRef.current)
      hide(addHandleRef.current)
      return
    }

    const { container, rect } = hovered
    const isInColumn = container.columnKey !== null
    const top = rect.top - anchorRect.top + 1
    const dragLeft = rect.left - anchorRect.left - HANDLE_GAP - HANDLE_WIDTH

    if (dragHandleRef.current) {
      dragHandleRef.current.style.opacity = '1'
      dragHandleRef.current.style.transform = `translate(${dragLeft}px, ${top}px)`
    }

    // Inside a column there is only room for one handle in the gutter, and the drag handle is
    // the one that has no keyboard equivalent — "/" opens the same menu the + does.
    if (addHandleRef.current) {
      if (isInColumn) {
        hide(addHandleRef.current)
      } else {
        addHandleRef.current.style.opacity = '1'
        addHandleRef.current.style.transform = `translate(${
          dragLeft - HANDLE_GAP - HANDLE_WIDTH
        }px, ${top}px)`
      }
    }
  }, [anchorElem, hovered])

  /* -------------------------------------------------------------- drag & drop */

  const showLine = useCallback(
    (target: DropTarget | null) => {
      const line = lineRef.current
      if (!line) return
      if (!target) {
        line.style.opacity = '0'
        return
      }
      const anchorRect = anchorElem.getBoundingClientRect()
      const y = target.isBelow ? target.slot.bottom : target.slot.top
      line.style.opacity = '1'
      line.style.width = `${target.container.contentWidth}px`
      line.style.transform = `translate(${target.container.contentLeft - anchorRect.left}px, ${
        y - anchorRect.top - 2
      }px)`
    },
    [anchorElem],
  )

  useEffect(() => {
    const onDragOver = (event: DragEvent) => {
      const draggedKey = draggedKeyRef.current
      if (!draggedKey) return

      const target = findDropTarget(
        collectDropContainers(editor),
        event.clientX,
        event.clientY,
        { allowColumns: !draggedIsRowRef.current, fuzzy: true },
      )

      // Landing back on the block being dragged is a no-op, so it gets no line and no drop
      // cursor — the drag reads as "nothing will happen here", which is what will happen.
      const valid = target && target.slot.key !== draggedKey
      dropRef.current = valid ? target : null
      showLine(valid ? target : null)

      // preventDefault is what tells the browser this is a legal drop site; without it no drop
      // event ever fires.
      if (valid) event.preventDefault()
    }

    const onDrop = (event: DragEvent) => {
      const draggedKey = draggedKeyRef.current
      const target = dropRef.current
      draggedKeyRef.current = null
      dropRef.current = null
      showLine(null)

      if (!draggedKey || !target) return
      event.preventDefault()

      editor.update(() => {
        const dragged = $getNodeByKey(draggedKey)
        const anchorNode = $getNodeByKey(target.slot.key)
        if (!dragged || !anchorNode || dragged === anchorNode) return
        // Dropping a block inside itself would detach the whole subtree from the document.
        if ($isElementNode(dragged) && dragged.isParentOf(anchorNode)) return

        // A blank line is a placeholder, not content: dropping onto one takes its place rather
        // than pushing it aside. This is also what makes dropping into an empty column read
        // correctly — the paragraph that column was holding open is exactly such a placeholder.
        // (Payload's own drag plugin treats empty paragraphs the same way.)
        if ($isParagraphNode(anchorNode) && anchorNode.getTextContent() === '') {
          anchorNode.insertBefore(dragged)
          anchorNode.remove()
        } else if (target.isBelow) {
          anchorNode.insertAfter(dragged)
        } else {
          anchorNode.insertBefore(dragged)
        }
        // A column left empty by the move is refilled by ColumnsPlugin's transform, which runs
        // before this update is reconciled — nothing to do here.
      })
    }

    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)
    return () => {
      document.removeEventListener('dragover', onDragOver)
      document.removeEventListener('drop', onDrop)
    }
  }, [editor, showLine])

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLButtonElement>) => {
      if (!hovered || !event.dataTransfer) return
      draggedKeyRef.current = hovered.key
      draggedIsRowRef.current = isRowKey(editor, hovered.key)
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData(DRAG_FORMAT, hovered.key)
      const elem = editor.getElementByKey(hovered.key)
      if (elem) event.dataTransfer.setDragImage(elem, 0, 0)
    },
    [editor, hovered],
  )

  const onDragEnd = useCallback(() => {
    draggedKeyRef.current = null
    dropRef.current = null
    showLine(null)
  }, [showLine])

  /* -------------------------------------------------------------------- + */

  const onAddClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (!hovered) return

      let targetKey: NodeKey | null = null

      editor.update(() => {
        const node = $getNodeByKey(hovered.key)
        if (!node) return
        // Clicking + on a line that is already blank uses that line rather than adding a second
        // one below it.
        const isBlank = $isParagraphNode(node) && node.getTextContent() === ''
        if (isBlank) {
          targetKey = node.getKey()
          node.selectStart()
          return
        }
        const paragraph = $createParagraphNode()
        node.insertAfter(paragraph)
        targetKey = paragraph.getKey()
        paragraph.selectStart()
      })

      // The slash menu attaches to the caret, so it can only be opened once the browser has
      // actually moved focus into the new paragraph.
      setTimeout(() => {
        editor.focus()
        editor.update(() => {
          const node = targetKey ? $getNodeByKey(targetKey) : null
          if ($isParagraphNode(node)) editor.dispatchCommand(ENABLE_SLASH_MENU_COMMAND, { node })
        })
      }, 0)
    },
    [editor, hovered],
  )

  return createPortal(
    <>
      <button
        aria-label="Kéo để di chuyển"
        className={`${HANDLE_CLASS} kmd-block-handle--drag`}
        draggable
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        ref={dragHandleRef}
        type="button"
      >
        <span />
      </button>
      <button
        aria-label="Thêm khối"
        className={`${HANDLE_CLASS} kmd-block-handle--add`}
        onClick={onAddClick}
        ref={addHandleRef}
        type="button"
      >
        <span />
      </button>
      <div className="kmd-drop-line" ref={lineRef} />
    </>,
    anchorElem,
  )
}
