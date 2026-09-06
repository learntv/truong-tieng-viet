import { describe, expect, it } from 'vitest'

import {
  countEmptyBaiInChang,
  countEmptyBaiInChuDe,
  isBaiEmpty,
  type BaiLike,
} from '@/lib/baiContent'
import {
  chuDeTree,
  EXPECTED_EMPTY_BAI,
  EXPECTED_EMPTY_PER_CHANG,
} from '../fixtures/chuDeTree'

describe('isBaiEmpty', () => {
  it('is true for a bài holding nothing at all', () => {
    expect(isBaiEmpty({})).toBe(true)
    expect(isBaiEmpty({ hinhs: [], meta: {} })).toBe(true)
    expect(isBaiEmpty({ hinhs: null, meta: null })).toBe(true)
  })

  it('is false for a bài with only a link', () => {
    expect(isBaiEmpty({ meta: { link: 'https://wordwall.net/embed/abc' } })).toBe(false)
  })

  it('is false for a bài with only a video', () => {
    expect(isBaiEmpty({ meta: { videoUrl: 'https://www.youtube.com/watch?v=abc' } })).toBe(false)
  })

  it('is false for a bài with only audio', () => {
    // An upload is a bare id in live form state and a populated document once fetched; both
    // count.
    expect(isBaiEmpty({ meta: { audio: 42 } })).toBe(false)
    expect(isBaiEmpty({ meta: { audio: { id: 42, url: '/media/a.mp3' } } })).toBe(false)
  })

  it('is false for a bài with only a hình', () => {
    expect(isBaiEmpty({ hinhs: [{ image: 7 }] })).toBe(false)
    expect(isBaiEmpty({ hinhs: [{ image: { id: 7, url: '/media/a.png' } }] })).toBe(false)
  })

  it('is false for a hình whose image cannot be resolved', () => {
    // The id is there, the file behind it isn't reachable. The teacher put a hình in this
    // bài, so it is not an empty bài — it is a broken image, a different problem.
    expect(isBaiEmpty({ hinhs: [{ image: 999999 }] })).toBe(false)
  })

  it('is true for a hình row added but not yet uploaded into', () => {
    // `image` is required, so this shape only exists between "add hình" and the upload
    // finishing. Counting it as content would clear the marker before anything was added.
    expect(isBaiEmpty({ hinhs: [{}] })).toBe(true)
    expect(isBaiEmpty({ hinhs: [{ image: null }] })).toBe(true)
  })

  it('treats blank text attachments as unset', () => {
    expect(isBaiEmpty({ meta: { link: '', videoUrl: '   ' } })).toBe(true)
  })
})

describe('counting empty bài', () => {
  const empty: BaiLike = {}
  const withHinh: BaiLike = { hinhs: [{ image: 1 }] }
  const withLink: BaiLike = { meta: { link: 'https://wordwall.net/embed/abc' } }

  it('counts across the nội dung inside a chặng', () => {
    const chang = {
      noiDungs: [{ bais: [empty, withHinh] }, { bais: [empty, empty, withLink] }],
    }
    expect(countEmptyBaiInChang(chang)).toBe(3)
  })

  it('counts zero for a chặng with nothing in it', () => {
    expect(countEmptyBaiInChang({ noiDungs: [] })).toBe(0)
    expect(countEmptyBaiInChang(null)).toBe(0)
  })

  it('counts across the chặng inside a chủ đề', () => {
    const chuDe = {
      changs: [
        { noiDungs: [{ bais: [empty, withHinh] }] },
        { noiDungs: [{ bais: [withHinh, withLink] }] },
        { noiDungs: [{ bais: [empty, empty] }] },
      ],
    }
    expect(countEmptyBaiInChuDe(chuDe)).toBe(3)
  })
})

describe('the predicate over a realistic tree', () => {
  it('finds the expected empty bài in a full chủ đề', () => {
    expect(countEmptyBaiInChuDe(chuDeTree)).toBe(EXPECTED_EMPTY_BAI)
  })

  it('attributes them to the right chặng', () => {
    expect(chuDeTree.changs.map(countEmptyBaiInChang)).toEqual(EXPECTED_EMPTY_PER_CHANG)
  })
})
