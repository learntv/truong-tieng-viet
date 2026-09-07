import { describe, expect, it } from 'vitest'

import { deriveSlug } from '@/lib/slug'

describe('deriveSlug', () => {
  it('folds a title with dashes and diacritics', () => {
    expect(deriveSlug('ONG – ÔNG – UNG – ƯNG')).toBe('ong-ong-ung-ung')
  })

  it('folds đ to d', () => {
    expect(deriveSlug('ĐI HỌC')).toBe('di-hoc')
  })

  it('collapses punctuation and repeated spaces', () => {
    expect(deriveSlug('Bé  đi,  học!!  ')).toBe('be-di-hoc')
  })
})
