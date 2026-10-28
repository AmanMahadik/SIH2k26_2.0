// scripts/build_logo_assets.js
// Generates all optimized image assets for web and mobile from the user's uploaded emblem.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const userUploadedEmblem = path.resolve('C:/Users/PC/.gemini/antigravity/brain/60a10219-4e1e-4964-bfcd-c1f8dd77e584/.user_uploaded/media_1793194738513_2bed798f.jpg');

async function buildAllLogos() {
  console.log('Processing user emblem from:', userUploadedEmblem);

  // 1. High-resolution master circular emblems
  await sharp(userUploadedEmblem).png().toFile('public/nirikshai_emblem.png');
  await sharp(userUploadedEmblem).jpeg({ quality: 95 }).toFile('public/nirikshai_logo.jpg');
  await sharp(userUploadedEmblem).png().toFile('public/logo.png');
  await sharp(userUploadedEmblem).jpeg({ quality: 95 }).toFile('public/logo.jpg');
  
  // Mobile app emblem & icons
  await sharp(userUploadedEmblem).png().toFile('mobile-app/assets/nirikshai_emblem.png');
  await sharp(userUploadedEmblem).png().toFile('mobile-app/assets/logo.png');
  await sharp(userUploadedEmblem).resize(1024, 1024).png().toFile('mobile-app/assets/icon.png');
  await sharp(userUploadedEmblem).resize(1024, 1024).png().toFile('mobile-app/assets/adaptive-icon.png');
  await sharp(userUploadedEmblem).resize(192, 192).png().toFile('public/favicon.png');

  // 2. Mobile Splash Screen (Emblem centered on clean white canvas)
  const splashEmblem = await sharp(userUploadedEmblem).resize(580, 580).toBuffer();
  await sharp({
    create: {
      width: 1242,
      height: 2436,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: splashEmblem, gravity: 'center' }])
  .png()
  .toFile('mobile-app/assets/splash.png');

  // 3. Horizontal Banner for Web & Mobile Navbars (1050 x 220)
  const bannerEmblem = await sharp(userUploadedEmblem).resize(200, 200).toBuffer();

  const svgText = Buffer.from(`
    <svg width="810" height="200" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="44" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="800" fill="#0B2E5C" letter-spacing="1.5">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</text>
      <text x="0" y="132" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-weight="900" fill="#8B1A1A" letter-spacing="-1">Niriksh<tspan fill="#0B2E5C">AI</tspan></text>
      <text x="0" y="174" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="700" fill="#D97706" letter-spacing="1.2">AICTE REGULATORY SCRUTINY BUREAU</text>
    </svg>
  `);

  await sharp({
    create: {
      width: 1050,
      height: 220,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    { input: bannerEmblem, left: 10, top: 10 },
    { input: svgText, left: 230, top: 10 }
  ])
  .png()
  .toFile('public/nirikshai_banner_logo.png');

  fs.copyFileSync('public/nirikshai_banner_logo.png', 'mobile-app/assets/nirikshai_banner_logo.png');

  console.log('All logo variants built successfully!');
}

buildAllLogos().catch(console.error);
