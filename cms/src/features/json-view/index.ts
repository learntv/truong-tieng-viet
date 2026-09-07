import { createServerFeature } from '@payloadcms/richtext-lexical'

/**
 * Server half of the JSON viewer. Nothing to register but the pointer to the client half — the
 * feature adds no nodes and stores nothing; it only reads the editor state back out.
 */
export const JsonViewFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/json-view/client#JsonViewFeatureClient',
  },
  key: 'jsonView',
})
