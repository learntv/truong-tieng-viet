/**
 * Rebuilding one block's own values out of Payload's flat form-state map.
 *
 * Payload keeps a form as a flat map from field path to field — `blocks.2.words.0.word` is not
 * an object anywhere, it is a key. A block's preview needs its sibling values as a nested
 * object (`{ words: [{ word: 'bóng bay' }] }`), so this module does the one thing every preview
 * needs: walk the slice of the map under a block's path and rebuild it. Same shape of problem
 * as `lib/baiFormState.ts`, but generic across all ten block types instead of one field set.
 */

export type FormFields = Record<string, { rows?: unknown; value?: unknown } | undefined>

type Tree = { [key: string]: Tree | unknown }

const isIndexKey = (key: string): boolean => /^\d+$/.test(key)

const setPath = (tree: Tree, segments: string[], value: unknown): void => {
  const [head, ...rest] = segments
  if (rest.length === 0) {
    tree[head] = value
    return
  }
  const existing = tree[head]
  const child: Tree = existing && typeof existing === 'object' ? (existing as Tree) : {}
  tree[head] = child
  setPath(child, rest, value)
}

/** Turns a tree whose keys are all array indices into an array, recursively. */
const toValue = (node: unknown): unknown => {
  // A `hasMany` field's value is already a real array on one leaf path (unlike an `array`
  // field, whose rows only become a tree of numeric string keys by being rebuilt from several
  // sub-paths here) — pass it through rather than re-deriving it from `Object.keys`, which
  // would collapse an empty array to `{}` instead of `[]`.
  if (Array.isArray(node)) return node.map(toValue)
  if (node === null || typeof node !== 'object') return node

  const tree = node as Tree
  const keys = Object.keys(tree)

  if (keys.length > 0 && keys.every(isIndexKey)) {
    const arr: unknown[] = new Array(Math.max(...keys.map(Number)) + 1)
    for (const key of keys) arr[Number(key)] = toValue(tree[key])
    return arr
  }

  const result: Record<string, unknown> = {}
  for (const key of keys) result[key] = toValue(tree[key])
  return result
}

/**
 * The values held at `blockPath` (e.g. `blocks.2`), as a plain nested object — arrays where
 * every sibling key was numeric, objects otherwise. Fields never entered are simply absent,
 * which is what an untouched block looks like in a saved document too.
 */
export const readBlockValue = <T extends Record<string, unknown>>(
  fields: FormFields,
  blockPath: string,
): T => {
  const tree: Tree = {}
  const prefix = `${blockPath}.`

  for (const [fieldPath, field] of Object.entries(fields ?? {})) {
    if (!fieldPath.startsWith(prefix)) continue

    // An `array` field's own path (e.g. `words`, `steps`) registers a field entry too, but its
    // `value` there is the row *count*, not the rows — Payload always tags that entry with a
    // `.rows` array instead (even `[]` for zero rows; see @payloadcms/ui's
    // addFieldStatePromise: `fieldState.rows = rows; fieldState.value = arrayValue.length`).
    // The real row data lives at the deeper `<path>.<rowIndex>.<field>` paths this loop also
    // sees, so skipping the count entry here is what keeps a freshly-added, still-empty array
    // from resolving to that count number instead of `[]` — and, since only an array/blocks
    // field ever carries `.rows`, this can never mistake a real scalar value (e.g. an upload
    // field's numeric media id) for one.
    if (field?.rows !== undefined) continue

    setPath(tree, fieldPath.slice(prefix.length).split('.'), field?.value)
  }

  return toValue(tree) as T
}
