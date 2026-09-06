import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config.js'

import { chuDeTree } from '../fixtures/chuDeTree'

/**
 * A quyển with one chủ đề under it, for the e2e journeys that need real content: reaching a
 * chủ đề from its quyển card, telling two same-named bài apart, walking the empty-bài counts.
 *
 * The tree is the same fixture the integration tests count against, so the numbers an e2e test
 * reads off the screen are the numbers `EXPECTED_EMPTY_BAI` states — the browser and the server
 * are being held to one fixture rather than to two that could drift.
 */
export type SeededContent = {
  chuDeID: number
  cleanup: () => Promise<void>
  quyenID: number
}

/** The smallest valid PNG: one transparent pixel. */
const imageFile = (name: string) => ({
  data: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  ),
  mimetype: 'image/png',
  name,
  size: 70,
})

const audioFile = (name: string) => ({
  data: Buffer.from('ID3', 'utf8'),
  mimetype: 'audio/mpeg',
  name,
  size: 3,
})

/** The slug this helper's throwaway quyển is created under. Unique, so it has to be reclaimed. */
const E2E_QUYEN_SLUG = 'quyen-e2e'

/**
 * Clears anything a previous run left behind.
 *
 * `slug` is unique on the quyển collection, so a run that was interrupted between creating the
 * quyển and its `cleanup()` makes every later run fail in `beforeAll` with a validation error —
 * and that failure looks nothing like its cause. Reclaiming the slug first makes the helper
 * idempotent, which is what a fixture that owns unique keys has to be.
 */
async function clearLeftovers(payload: Payload): Promise<void> {
  const { docs } = await payload.find({
    collection: 'quyen',
    depth: 0,
    pagination: false,
    where: { slug: { equals: E2E_QUYEN_SLUG } },
  })

  for (const quyen of docs) {
    // The chủ đề reference the quyển, so they go first.
    await payload.delete({
      collection: 'chu-de',
      overrideAccess: true,
      where: { quyen: { equals: quyen.id } },
    })
    await payload.delete({ collection: 'quyen', id: quyen.id, overrideAccess: true })
  }
}

export async function seedChuDe(): Promise<SeededContent> {
  const payload: Payload = await getPayload({ config })
  await clearLeftovers(payload)

  const created: { collection: 'chu-de' | 'media' | 'quyen'; id: number }[] = []

  // The fixture names media by made-up id; an upload field insists on a real document.
  const mediaIds = new Map<number, number>()
  for (const [fixtureId, file] of [
    [101, imageFile('e2e-hinh-101.png')],
    [102, imageFile('e2e-hinh-102.png')],
    [103, imageFile('e2e-hinh-103.png')],
    [201, audioFile('e2e-am-thanh-201.mp3')],
  ] as const) {
    const doc = await payload.create({ collection: 'media', data: { alt: file.name }, file })
    created.push({ collection: 'media', id: doc.id })
    mediaIds.set(fixtureId, doc.id)
  }

  const quyen = await payload.create({
    collection: 'quyen',
    data: { slug: E2E_QUYEN_SLUG, title: 'Quyển thử e2e' },
    overrideAccess: true,
  })
  created.push({ collection: 'quyen', id: quyen.id })

  const chuDe = await payload.create({
    collection: 'chu-de',
    data: { ...toStorable(mediaIds), quyen: quyen.id },
  })
  created.push({ collection: 'chu-de', id: chuDe.id })

  return {
    chuDeID: chuDe.id,
    quyenID: quyen.id,
    cleanup: async () => {
      // Reverse order: the chủ đề references the quyển and the media.
      for (const { collection, id } of created.reverse()) {
        await payload.delete({ collection, id, overrideAccess: true })
      }
    },
  }
}

/**
 * The fixture as the database will accept it: real media ids, and without the hình row that
 * has no image — `image` is `required`, so that shape exists only in form state, and the bài
 * holding it is empty either way.
 */
function toStorable(mediaIds: Map<number, number>) {
  return {
    ...chuDeTree,
    changs: chuDeTree.changs.map((chang) => ({
      ...chang,
      noiDungs: chang.noiDungs.map((noiDung) => ({
        ...noiDung,
        bais: noiDung.bais.map((bai) => {
          const meta = 'meta' in bai ? bai.meta : undefined
          const hinhs = 'hinhs' in bai ? (bai.hinhs ?? []) : []

          return {
            ...bai,
            hinhs: hinhs
              .filter((hinh) => hinh.image != null)
              .map((hinh) => ({ ...hinh, image: mediaIds.get(hinh.image as number)! })),
            meta: meta && 'audio' in meta ? { ...meta, audio: mediaIds.get(meta.audio)! } : meta,
          }
        }),
      })),
    })),
  }
}
