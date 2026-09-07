import type { BlocksFeatureProps } from '@payloadcms/richtext-lexical'

import { BlocksFeature } from '@payloadcms/richtext-lexical'

/**
 * Payload's `BlocksFeature`, pointed at our own client half so the insert menus can show a preview
 * of each block instead of a row of identical block glyphs — see ./client/index.tsx.
 *
 * Everything the server feature does (sanitising the block configs, node registration, validation,
 * generated types) is Payload's, unchanged; only the `ClientFeature` pointer is swapped. The
 * feature keeps its `blocks` key, which is what the client schema map and the rest of the editor
 * config address it by, so this stays a drop-in replacement for `BlocksFeature`.
 */
export const KmdBlocksFeature = (props: BlocksFeatureProps): ReturnType<typeof BlocksFeature> => {
  const provider = BlocksFeature(props)
  const baseFeature = provider.feature

  if (typeof baseFeature !== 'function') return provider

  return {
    ...provider,
    feature: async (args) => ({
      ...(await baseFeature(args)),
      ClientFeature: '@/features/kmd-blocks/client#KmdBlocksFeatureClient',
    }),
  }
}
