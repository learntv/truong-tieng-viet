import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical'

import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
} from '@payloadcms/richtext-lexical/lexical'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  $createColumnNode,
  $createColumnsNode,
  $isColumnNode,
  $isColumnsNode,
  ColumnNode,
  ColumnsNode,
} from '@/features/columns/nodes/ColumnsNode'
import {
  $createColumns,
  $getColumns,
  $insertColumns,
  $normalizeColumn,
  $normalizeColumns,
  $setColumnCount,
  $unwrapColumns,
} from '@/features/columns/nodes/operations'

let editor: LexicalEditor

beforeEach(() => {
  editor = createHeadlessEditor({
    nodes: [ColumnsNode, ColumnNode],
    onError: (error) => {
      throw error
    },
  })
  // The transforms the editor registers in the browser (see ColumnsPlugin.tsx), registered here
  // too, so these tests exercise the same convergence the editor relies on.
  editor.registerNodeTransform(ColumnNode, $normalizeColumn)
  editor.registerNodeTransform(ColumnsNode, $normalizeColumns)
})

/** Run `fn` inside an editor update and hand back whatever it returns, read afterwards. */
const update = (fn: () => void): void => {
  editor.update(fn, { discrete: true })
}

const read = <T,>(fn: () => T): T => editor.getEditorState().read(fn)

/** The document as `['columnText | columnText', 'paragraphText']`, one entry per top-level block. */
const shape = (): string[] =>
  read(() =>
    $getRoot()
      .getChildren()
      .map((child) =>
        $isColumnsNode(child)
          ? $getColumns(child)
              .map((column) =>
                column
                  .getChildren()
                  .map((block) => block.getTextContent())
                  .join('/'),
              )
              .join(' | ')
          : child.getTextContent(),
      ),
  )

const paragraph = (text: string) => {
  const node = $createParagraphNode()
  if (text) node.append($createTextNode(text))
  return node
}

describe('$createColumns', () => {
  it('gives every column the empty paragraph that holds it open', () => {
    update(() => {
      $getRoot().append($createColumns(3))
    })
    expect(shape()).toEqual([' |  | '])
    expect(read(() => $getColumns($getRoot().getFirstChild() as ColumnsNode).length)).toBe(3)
  })

  it('clamps a count outside the offered range', () => {
    update(() => {
      $getRoot().append($createColumns(9 as never))
    })
    expect(read(() => $getColumns($getRoot().getFirstChild() as ColumnsNode).length)).toBe(3)
  })
})

describe('$setColumnCount', () => {
  const seed = (counts: string[][]) =>
    update(() => {
      const columns = $createColumnsNode()
      for (const blocks of counts) {
        const column = $createColumnNode()
        for (const text of blocks) column.append(paragraph(text))
        columns.append(column)
      }
      $getRoot().append(columns)
    })

  it('appends blank columns when growing', () => {
    seed([['a']])
    update(() => {
      $setColumnCount($getRoot().getFirstChild() as ColumnsNode, 3)
    })
    expect(shape()).toEqual(['a |  | '])
  })

  it('moves the content of dropped columns onto the last surviving one', () => {
    seed([['a'], ['b'], ['c']])
    update(() => {
      $setColumnCount($getRoot().getFirstChild() as ColumnsNode, 2)
    })
    expect(shape()).toEqual(['a | b/c'])
  })

  it('does not accumulate the blank paragraphs it merges', () => {
    seed([['a'], [''], ['']])
    update(() => {
      $setColumnCount($getRoot().getFirstChild() as ColumnsNode, 1)
    })
    expect(shape()).toEqual(['a'])
  })

  it('leaves a column that merged nothing with a paragraph to type into', () => {
    seed([[''], ['']])
    update(() => {
      $setColumnCount($getRoot().getFirstChild() as ColumnsNode, 1)
    })
    expect(read(() => $getColumns($getRoot().getFirstChild() as ColumnsNode)[0].getChildrenSize())).toBe(1)
  })
})

describe('$unwrapColumns', () => {
  it('leaves the content behind as top-level blocks, in reading order', () => {
    update(() => {
      const columns = $createColumnsNode()
      for (const texts of [['a', 'b'], ['c']]) {
        const column = $createColumnNode()
        for (const text of texts) column.append(paragraph(text))
        columns.append(column)
      }
      $getRoot().append(columns)
    })
    update(() => {
      $unwrapColumns($getRoot().getFirstChild() as ColumnsNode)
    })
    expect(shape()).toEqual(['a', 'b', 'c'])
  })

  it('leaves something to type into when every column was blank', () => {
    update(() => {
      $getRoot().append($createColumns(2))
    })
    update(() => {
      $unwrapColumns($getRoot().getFirstChild() as ColumnsNode)
    })
    expect(shape()).toEqual([''])
  })
})

describe('$insertColumns', () => {
  it('replaces the blank line it was invoked from', () => {
    update(() => {
      $getRoot().append(paragraph(''))
      $insertColumns(2, $getRoot().getFirstChild())
    })
    expect(shape()).toEqual([' | '])
  })

  it('keeps a line that has something on it', () => {
    update(() => {
      $getRoot().append(paragraph('a'))
      $insertColumns(2, $getRoot().getFirstChild())
    })
    expect(shape()).toEqual(['a', ' | '])
  })

  it('never nests: from inside a column the new row lands after the one it was in', () => {
    update(() => {
      $getRoot().append($createColumns(2))
    })
    update(() => {
      const firstColumn = $getColumns($getRoot().getFirstChild() as ColumnsNode)[0]
      $insertColumns(3, firstColumn.getFirstChild())
    })
    expect(shape()).toEqual([' | ', ' |  | '])
    expect(read(() => $getRoot().getChildrenSize())).toBe(2)
  })
})

describe('normalization', () => {
  it('refills a column emptied by a deletion', () => {
    update(() => {
      $getRoot().append($createColumns(2))
    })
    update(() => {
      const column = $getColumns($getRoot().getFirstChild() as ColumnsNode)[0]
      column.getFirstChild()?.remove()
    })
    expect(read(() => $getColumns($getRoot().getFirstChild() as ColumnsNode)[0].getChildrenSize())).toBe(1)
  })

  it('drops a row once its last column is gone', () => {
    update(() => {
      $getRoot().append($createColumns(1))
    })
    update(() => {
      $getColumns($getRoot().getFirstChild() as ColumnsNode)[0].remove()
    })
    expect(read(() => $getRoot().getChildrenSize())).toBe(0)
  })

  it('flattens a row that ends up inside a column', () => {
    update(() => {
      const outer = $createColumns(1)
      $getRoot().append(outer)
      const inner = $createColumnsNode()
      const innerColumn = $createColumnNode()
      innerColumn.append(paragraph('nested'))
      inner.append(innerColumn)
      $getColumns(outer)[0].append(inner)
    })
    expect(shape()).toEqual(['/nested'])
    expect(
      read(() =>
        $getColumns($getRoot().getFirstChild() as ColumnsNode)[0]
          .getChildren()
          .some($isColumnsNode),
      ),
    ).toBe(false)
  })

  it('unwraps a column that lost its row', () => {
    update(() => {
      const column = $createColumnNode()
      column.append(paragraph('loose'))
      $getRoot().append(column)
    })
    expect(shape()).toEqual(['loose'])
    expect(read(() => $getRoot().getChildren().some($isColumnNode))).toBe(false)
  })

  it('takes a pasted row of four columns down to three', () => {
    update(() => {
      const columns = $createColumnsNode()
      for (const text of ['a', 'b', 'c', 'd']) {
        columns.append($createColumnNode().append(paragraph(text)))
      }
      $getRoot().append(columns)
    })
    expect(shape()).toEqual(['a | b | c/d'])
  })

  it('wraps loose inline content dropped straight into a column', () => {
    update(() => {
      const columns = $createColumns(1)
      $getRoot().append(columns)
      $getColumns(columns)[0].append($createTextNode('loose text'))
    })
    expect(shape()).toEqual(['/loose text'])
    expect(
      read(() =>
        $getColumns($getRoot().getFirstChild() as ColumnsNode)[0]
          .getChildren()
          .every((child) => !child.isInline()),
      ),
    ).toBe(true)
  })
})

describe('serialization', () => {
  it('round-trips through JSON with the row intact', () => {
    update(() => {
      const columns = $createColumnsNode()
      for (const text of ['trái', 'phải']) {
        columns.append($createColumnNode().append(paragraph(text)))
      }
      $getRoot().append(columns)
    })

    const json = editor.getEditorState().toJSON()
    expect((json.root.children[0] as { type: string }).type).toBe('columns')

    const restored = createHeadlessEditor({
      nodes: [ColumnsNode, ColumnNode],
      onError: (error) => {
        throw error
      },
    })
    restored.setEditorState(restored.parseEditorState(json))
    expect(
      restored.getEditorState().read(() =>
        $getColumns($getRoot().getFirstChild() as ColumnsNode).map((column) =>
          column.getTextContent(),
        ),
      ),
    ).toEqual(['trái', 'phải'])
  })
})
