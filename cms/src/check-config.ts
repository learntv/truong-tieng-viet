import config from '@payload-config'

async function main() {
  const cfg = await config
  console.log('collections:', cfg.collections.map((c) => c.slug).join(', '))
  const show = (slug: string) => {
    const c = cfg.collections.find((x) => x.slug === slug)!
    console.log(slug, '| defaultSort:', c.defaultSort, '| fields:', c.flattenedFields.map((f: any) => f.name).join(','))
  }
  show('quyen'); show('chu-de'); show('chang'); show('noi-dung'); show('bai')
}
main()
