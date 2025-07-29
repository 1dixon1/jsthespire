const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure electron/assets directory exists
const assetsDir = path.join(__dirname, '..', 'electron', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple PNG icon programmatically
async function createSimpleIcon() {
    const size = 256;
    
    // Create a simple gradient background
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2d3436;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#636e72;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fdcb6e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e17055;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="url(#bg)" rx="20"/>
        
        <!-- Card 1 -->
        <rect x="60" y="80" width="60" height="80" fill="url(#card)" rx="8" stroke="#fff" stroke-width="2"/>
        <text x="90" y="120" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="bold">ATK</text>
        
        <!-- Card 2 -->
        <rect x="140" y="100" width="60" height="80" fill="url(#card)" rx="8" stroke="#fff" stroke-width="2"/>
        <text x="170" y="140" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="bold">DEF</text>
        
        <!-- Energy orb -->
        <circle cx="128" cy="200" r="15" fill="#74b9ff" stroke="#fff" stroke-width="2"/>
        <text x="128" y="205" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="bold">⚡</text>
    </svg>
    `;
    
    // Convert SVG to PNG
    await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(assetsDir, 'icon.png'));
    
    console.log('Generated icon.png');
}

// Generate different sizes
async function generateSizes() {
    const sizes = [16, 32, 48, 64, 128, 256];
    const sourceIcon = path.join(__dirname, '..', 'electron', 'assets', 'icon.png');
    
    for (const size of sizes) {
        await sharp(sourceIcon)
            .resize(size, size)
            .png()
            .toFile(path.join(assetsDir, `icon-${size}.png`));
        
        console.log(`Generated icon-${size}.png`);
    }
}

// Copy main icon as ICO and ICNS (simplified)
async function copyIcons() {
    const sourceIcon = path.join(assetsDir, 'icon.png');
    
    // Copy as ICO (Windows)
    await sharp(sourceIcon)
        .resize(256, 256)
        .png()
        .toFile(path.join(assetsDir, 'icon.ico'));
    
    // Copy as ICNS (macOS)
    await sharp(sourceIcon)
        .resize(512, 512)
        .png()
        .toFile(path.join(assetsDir, 'icon.icns'));
    
    console.log('Generated icon.ico and icon.icns');
}

// Main function
async function main() {
    try {
        console.log('Generating icons...');
        
        await createSimpleIcon();
        await generateSizes();
        await copyIcons();
        
        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

main(); 