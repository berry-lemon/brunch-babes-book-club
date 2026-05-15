import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const IMAGES_DIR = './public/images';

const images = [
  {
    filename: 'hero.jpg',
    prompt: 'Stunning overhead flatlay on a white marble surface: open books with pink and red spines, two champagne flutes filled with mimosas, scattered pink rose petals, a small vase of peonies, a croissant on a white plate, gold utensils. Soft natural window light, cherry red and blush pink color palette, editorial lifestyle photography, ultra clean and elegant.',
  },
  {
    filename: 'book-pick.jpg',
    prompt: 'Closeup editorial flatlay: a worn copy of Pride and Prejudice by Jane Austen lying open, surrounded by pink peonies, a half-drunk mimosa, a vintage gold bookmark, and a soft linen napkin. Warm soft light, blush and cream tones, feminine and literary, magazine-quality still life photography.',
  },
  {
    filename: 'community.jpg',
    prompt: 'A group of stylish diverse women in their 20s and 30s sitting around a sunlit table at a weekend brunch, laughing and talking, books and mimosas on the table, bright airy restaurant setting. Candid and warm, editorial lifestyle photography, joyful energy, cherry red and pink accents in clothing and flowers.',
  },
  {
    filename: 'about.jpg',
    prompt: 'Cozy lifestyle photo: a woman\'s hands holding an open book, a mimosa and a small plate of fruit on the table beside her, warm soft sunlight, blush pink tones, feminine and editorial, shallow depth of field, inviting and relaxed atmosphere.',
  },
];

async function generateImage(prompt, filename) {
  console.log(`Generating ${filename}…`);
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
  });

  const b64 = response.generatedImages[0].image.imageBytes;
  const buffer = Buffer.from(b64, 'base64');
  const outPath = path.join(IMAGES_DIR, filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✓ Saved → ${outPath}`);
}

async function main() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
    console.error('Add your GEMINI_API_KEY to .env first.');
    process.exit(1);
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const img of images) {
    await generateImage(img.prompt, img.filename);
  }

  console.log('\nAll images generated in ./public/images/');
  console.log('Reference them in index.html as: src="./images/hero.jpg" etc.');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
