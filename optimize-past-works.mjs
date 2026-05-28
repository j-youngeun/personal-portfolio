import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const srcDir = path.resolve('public/assets/past-works')
const outDir = path.resolve('public/assets/past-works/optimized')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const files = [
  'Group 1917.jpg',
  'Group 1919.jpg',
  'Group 1921.jpg',
  'Group 1922.jpg',
  'Group 1924.jpg',
  'Group 1926.jpg',
  'Group 1930.jpg',
  'Group 1933.png',
]

const run = async () => {
  for (const file of files) {
    const input = path.join(srcDir, file)
    const outName = file.replace(/\.[^.]+$/, '.webp')
    const output = path.join(outDir, outName)
    console.log('Optimizing', file, '->', outName)
    await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(output)
  }
  console.log('Done optimizing images.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
