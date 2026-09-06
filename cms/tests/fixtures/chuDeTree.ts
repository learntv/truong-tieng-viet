/**
 * A chủ đề shaped exactly the way a real one is stored — chủ đề → chặng → nội dung → bài →
 * hình — sized down to something a test can read at a glance but keeping every shape the
 * predicate has to survive in the wild: bài with a picture, with only audio, with only a
 * link, with nothing, and a hình row whose upload never landed.
 *
 * Shared by the unit test of the predicate and the integration test of the roll-up endpoint,
 * so both are asserted against the same tree: if the client and the server ever disagree, it
 * shows up as the two of them producing different numbers from this one fixture.
 */

/** How many bài in this fixture hold nothing. Stated here so a test asserts a number a
 * reader can check by eye against the tree below, rather than one the predicate computed. */
export const EXPECTED_EMPTY_BAI = 4

export const chuDeTree = {
  title: 'Chào hỏi',
  changs: [
    {
      title: 'Chặng 1',
      noiDungs: [
        {
          title: 'Nghe và nhắc lại',
          bais: [
            // A picture with a caption — the common case.
            {
              title: 'Nhìn hình, nghe và nhắc lại',
              hinhs: [{ image: 101, captions: [{ text: '– Con chào mẹ ạ.' }] }],
            },
            // Same title as the one above; only its content tells them apart.
            {
              title: 'Nhìn hình, nghe và nhắc lại',
              hinhs: [{ image: 102, captions: [{ text: '– Chào con.' }] }],
            },
            // Nothing at all.
            { title: 'Nhìn hình, nghe và nhắc lại' },
          ],
        },
        {
          title: 'Luyện tập',
          bais: [
            // Audio only — not empty.
            { title: 'Nghe', meta: { audio: 201 } },
            // A hình row added but never uploaded into — still empty.
            { title: 'Chưa xong', hinhs: [{ image: null }] },
          ],
        },
      ],
    },
    {
      title: 'Chặng 2',
      noiDungs: [
        {
          title: 'Trò chơi',
          bais: [
            // A link only — not empty.
            { title: 'Trò chơi Wordwall', meta: { link: 'https://wordwall.net/embed/abc' } },
            // A video only — not empty.
            { title: 'Xem video', meta: { videoUrl: 'https://www.youtube.com/watch?v=abc' } },
            // Attachments present but blank — empty.
            { title: 'Chưa có gì', meta: { link: '', videoUrl: '   ' } },
          ],
        },
      ],
    },
    {
      // A chặng with no empty bài at all: it must report no count.
      title: 'Chặng 3',
      noiDungs: [
        {
          title: 'Ôn tập',
          bais: [{ title: 'Ôn lại', hinhs: [{ image: 103, captions: [] }] }],
        },
      ],
    },
    {
      // A chặng that is entirely empty bài.
      title: 'Chặng 4',
      noiDungs: [{ title: 'Sắp làm', bais: [{ title: 'Chưa đặt tên' }] }],
    },
  ],
}

/** Empty-bài counts per chặng, in the order the chặng appear above. */
export const EXPECTED_EMPTY_PER_CHANG = [2, 1, 0, 1]
