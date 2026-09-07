import { createServerFeature } from '@payloadcms/richtext-lexical'

/**
 * Server half of the colour feature. There is nothing to register here beyond the pointer to the
 * client half: colours are stored as an inline `style` on Lexical's own `TextNode`, which Payload
 * already knows how to serialise, so the feature adds no node types and no schema.
 */
export const TextColorFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/text-color/client#TextColorFeatureClient',
  },
  key: 'textColor',
})
