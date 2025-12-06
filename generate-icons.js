const fs = require('fs');
const path = require('path');

// Create minimal valid PNG files with correct headers
function createPNG(size, filename) {
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCrc = Buffer.from([0x78, 0x9C, 0x63, 0x62]); // Simplified CRC
  
  // Create a simple image data (green square with white circle)
  const pixelData = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const centerX = size / 2;
      const centerY = size / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      if (distance < size / 6) {
        // Inner green circle
        pixelData.push(16, 185, 129); // RGB for #10b981
      } else if (distance < size / 3) {
        // White circle
        pixelData.push(255, 255, 255);
      } else {
        // Green background
        pixelData.push(16, 185, 129);
      }
    }
  }
  
  // Create PNG with minimal structure
  const chunks = [
    pngSignature,
    // IHDR chunk
    Buffer.concat([
      Buffer.from([0x00, 0x00, 0x00, 0x0D]), // Length
      Buffer.from('IHDR'),
      ihdrData,
      ihdrCrc
    ]),
    // IDAT chunk (simplified)
    Buffer.concat([
      Buffer.from([0x00, 0x00, 0x00, pixelData.length]),
      Buffer.from('IDAT'),
      Buffer.from(pixelData),
      Buffer.from([0x00, 0x00, 0x00, 0x00]) // Simplified CRC
    ]),
    // IEND chunk
    Buffer.from([
      0x00, 0x00, 0x00, 0x00, // Length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ])
  ];
  
  const pngBuffer = Buffer.concat(chunks);
  fs.writeFileSync(filename, pngBuffer);
  console.log, (`CreatedCreated ${枚 ${filename}`);
} size, filename};
}

// Create both icons
try {
  createPNG(192, 'public/icon-192.png');
  createPNG(512, 'public/icon-512.png');
  console.log('Icons created successfully');
} catch (error) {
  console.error('Error creating icons:', error);
}
