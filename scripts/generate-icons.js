#!/usr/bin/env node
// scripts/generate-icons.js
// Run: node scripts/generate-icons.js
// Generates placeholder SVG-based PNG icons for PWA manifest

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(__dirname, '../public/icons')

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true })

// Create a simple SVG icon for each size
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#0d1258"/>
  <rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}" rx="${size*0.18}" fill="#1a237e"/>
  <text x="${size/2}" y="${size*0.65}" text-anchor="middle" font-size="${size*0.45}" font-family="serif">🚛</text>
  <text x="${size/2}" y="${size*0.88}" text-anchor="middle" font-size="${size*0.1}" font-family="sans-serif" fill="#3b82f6" font-weight="bold">TowNow</text>
</svg>`
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svg)
  console.log(`Created icon-${size}.svg`)
})

console.log('\nSVG icons created in public/icons/')
console.log('Note: For production, convert to PNG using sharp or an online tool.')
console.log('The app will work with SVG icons for development.')
