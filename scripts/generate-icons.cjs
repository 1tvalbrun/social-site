#!/usr/bin/env node

/**
 * Icon Generation Script
 * 
 * This script generates SVG icons from the Star of David design
 * Run with: node scripts/generate-icons.cjs
 */

const fs = require('fs');
const path = require('path');

// Function to create Star of David SVG
function createStarOfDavidSVG(size) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
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

// Generate icons for different sizes
const sizes = [192, 256, 384, 512];

try {
  // Create public directory if it doesn't exist
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  sizes.forEach(size => {
    const svgContent = createStarOfDavidSVG(size);
    const filename = `icon-${size}.svg`;
    const filepath = path.join(publicDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`Generated ${filename}`);
  });

  console.log('\n✓ SVG icons generated successfully!');
  console.log('\nNote: For better PWA compatibility, you may want to convert these to PNG format.');
  console.log('You can use online converters or tools like ImageMagick for conversion.');

} catch (error) {
  console.error('Error generating icons:', error);
} 