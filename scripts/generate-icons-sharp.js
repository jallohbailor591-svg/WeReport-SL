const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_SVG = path.join(__dirname, '../public/icon.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
    if (!fs.existsSync(INPUT_SVG)) {
        console.error('Error: public/icon.svg not found!');
        process.exit(1);
    }

    try {
        // Generate 192x192 PNG
        await sharp(INPUT_SVG)
            .resize(192, 192)
            .png()
            .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));

        // Generate 512x512 PNG
        await sharp(INPUT_SVG)
            .resize(512, 512)
            .png()
            .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));

        console.log('Icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
