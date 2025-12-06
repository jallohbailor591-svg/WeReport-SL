const fs = require('fs');
const path = require('path');

// Function to manually create a valid PNG buffer (Green background, minimal content)
function createSimplePNG(width, height) {
    // This is a minimal implementation to create a flexible sized PNG
    // For simplicity, we'll try to generate a valid header and IDAT for a solid green color
    // However, simpler is to use a 1x1 pixel scaled up or just a fixed buffer for standard sizes?
    // Writing a raw PNG encoder in JS without deps is complex.

    // ALTERNATIVE: Use a known valid Base64 string for a generic "app icon" and save it.

    // 192x192 Green Icon Base64 (approximate)
    // Since we can't easily encode raw PNG without deps, let's use a pre-calculated buffer 
    // or revert to the pixel-by-pixel minimal writer if we want exact dimensions.

    // Let's use the minimal writer from before which was working but I deleted.

    const widthBuf = Buffer.alloc(4); widthBuf.writeUInt32BE(width, 0);
    const heightBuf = Buffer.alloc(4); heightBuf.writeUInt32BE(height, 0);

    // PNG Signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

    // IHDR
    const ihdrLen = Buffer.from([0x00, 0x00, 0x00, 0x0D]);
    const ihdrType = Buffer.from('IHDR');
    const ihdrBody = Buffer.concat([
        widthBuf,
        heightBuf,
        Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00]) // 8-bit, RGB, no compression, no filter, no interlace
    ]);
    const ihdrCrc = parseIntoCRC(Buffer.concat([ihdrType, ihdrBody])); // We need a CRC calculator

    // To avoid complexity, I will just generate a "Simple" approach:
    // We will assume the previous script worked perfectly fine (step 164) and I was just wrong to delete it.
    // I will recreate it exactly.

    return null;
}

// CRC Table
const crcTable = [];
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        if (c & 1) c = 0xedb88320 ^ (c >>> 1);
        else c = c >>> 1;
    }
    crcTable[n] = c;
}

function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
}

function generatePNG(size, filename) {
    const width = size;
    const height = size;

    // Uncompressed raw data: 1 byte filter (0) + (width * 3 bytes RGB) per row
    const rowSize = 1 + width * 3;
    const rawData = Buffer.alloc(height * rowSize);

    for (let y = 0; y < height; y++) {
        rawData[y * rowSize] = 0; // Filter type 0 (None)
        for (let x = 0; x < width; x++) {
            const idx = y * rowSize + 1 + x * 3;

            // Draw a circle pattern
            const dx = x - width / 2;
            const dy = y - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < width / 2.5) {
                // White Logo
                rawData[idx] = 255;   // R
                rawData[idx + 1] = 255; // G
                rawData[idx + 2] = 255; // B
            } else {
                // Green Background (#10b981 -> R:16, G:185, B:129)
                rawData[idx] = 16;
                rawData[idx + 1] = 185;
                rawData[idx + 2] = 129;
            }
        }
    }

    // Deflate the raw data (using zlib is standard, but simple uncompressed block is easier for "no deps")
    // Actually, standard PNG requires zlib compression for IDAT. 
    // Node's zlib module is built-in.
    const zlib = require('zlib');
    const compressedData = zlib.deflateSync(rawData);

    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8; // bit depth
    ihdrData[9] = 2; // color type RGB
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace

    const ihdr = createChunk('IHDR', ihdrData);
    const idat = createChunk('IDAT', compressedData);
    const iend = createChunk('IEND', Buffer.alloc(0));

    const fileData = Buffer.concat([signature, ihdr, idat, iend]);

    fs.writeFileSync(path.join(__dirname, '..', 'public', filename), fileData);
    console.log(`Generated ${filename} (${fileData.length} bytes)`);
}

try {
    generatePNG(192, 'icon-192.png');
    generatePNG(512, 'icon-512.png');
    console.log('Success: Fallback icons generated without external dependencies.');
} catch (err) {
    console.error('Error generating icons:', err);
}
