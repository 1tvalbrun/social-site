#!/usr/bin/env node

/**
 * Icon Generation Script
 * 
 * This script generates PNG icons from the SVG Star of David icon
 * Run with: node scripts/generate-icons.js
 * 
 * Note: You may need to install dependencies first:
 * npm install canvas
 */

const fs = require('fs');
const path = require('path');

// Function to create canvas-based Star of David
function createStarOfDavidCanvas(size) {
  // For environments without canvas, create a simple HTML preview
  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#starGradient)" stroke="#1e40af" stroke-width="4"/>
  
  <!-- Star of David -->
  <g transform="translate(${size/2},${size/2})">
    <!-- First triangle (pointing up) -->
    <polygon points="0,${-size/6.4} ${size/7.4},${size/12.8} ${-size/7.4},${size/12.8}" 
             fill="white" 
             stroke="white" 
             stroke-width="3"/>
    
    <!-- Second triangle (pointing down) -->
    <polygon points="0,${size/6.4} ${-size/7.4},${-size/12.8} ${size/7.4},${-size/12.8}" 
             fill="white" 
             stroke="white" 
             stroke-width="3"/>
  </g>
</svg>`;
  
  return svgContent;
}

// Generate SVG icons for different sizes
const sizes = [192, 256, 384, 512];

try {
  // Create public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  sizes.forEach(size => {
    const svgContent = createStarOfDavidCanvas(size);
    const filename = `icon-${size}.svg`;
    const filepath = path.join(publicDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`Generated ${filename}`);
  });

  // Create a conversion instruction file
  const instructions = `
# Icon Generation Instructions

The SVG icons have been generated. To convert them to PNG format, you can use one of these methods:

## Method 1: Online Converter
1. Go to https://convertio.co/svg-png/ or similar
2. Upload each SVG file from the public folder
3. Download the PNG versions
4. Replace the SVG files with PNG files keeping the same names

## Method 2: Using ImageMagick (if installed)
Run these commands from the project root:
\`\`\`bash
magick public/icon-192.svg public/icon-192.png
magick public/icon-256.svg public/icon-256.png
magick public/icon-384.svg public/icon-384.png
magick public/icon-512.svg public/icon-512.png
\`\`\`

## Method 3: Using Node.js with sharp (automated)
1. Install sharp: \`npm install sharp\`
2. Run: \`node scripts/convert-to-png.js\`

The SVG icon will work for modern browsers, but PNG versions are recommended for better compatibility.
`;

  fs.writeFileSync(path.join(process.cwd(), 'ICON_INSTRUCTIONS.md'), instructions);
  console.log('\nGenerated ICON_INSTRUCTIONS.md with conversion instructions');
  console.log('✓ Icon generation completed!');

} catch (error) {
  console.error('Error generating icons:', error);
} 