// File: generate-icons.js
// Run with: node generate-icons.js

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = 'assets/logo.svg';

async function generateIcons() {
    console.log('Generating PWA icons...');
    
    try {
        // Read source SVG
        const svgBuffer = await fs.readFile(sourceIcon);
        
        // Generate each size
        for (const size of iconSizes) {
            const outputFile = `assets/icon-${size}x${size}.png`;
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputFile);
            
            console.log(`Generated: ${outputFile}`);
        }
        
        // Generate badge icon
        await sharp(svgBuffer)
            .resize(72, 72)
            .png()
            .toFile('assets/badge-72x72.png');
        
        console.log('Generated: assets/badge-72x72.png');
        
        // Generate app preview images (placeholder)
        console.log('\nNote: Please create the following images manually:');
        console.log('- assets/app-preview.png (1280x720)');
        console.log('- assets/app-preview-mobile.png (750x1334)');
        console.log('\nIcon generation complete!');
        
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

// Create package.json entry
const packageJson = {
    name: "microokoa-website",
    version: "1.0.0",
    description: "Microokoa Guaranty Capital Website",
    scripts: {
        "build:icons": "node generate-icons.js",
        "start": "live-server --port=8080",
        "deploy": "npm run build:icons && echo 'Ready for deployment'"
    },
    dependencies: {
        "sharp": "^0.33.0"
    },
    devDependencies: {
        "live-server": "^1.2.2"
    }
};

async function setupProject() {
    console.log('Setting up project structure...');
    
    try {
        // Create directories
        await fs.mkdir('assets', { recursive: true });
        await fs.mkdir('icons', { recursive: true });
        
        // Write package.json
        await fs.writeFile(
            'package.json',
            JSON.stringify(packageJson, null, 2)
        );
        
        // Write generate-icons.js
        await fs.writeFile(
            'generate-icons.js',
            require('fs').readFileSync(__filename, 'utf-8')
        );
        
        console.log('\nSetup complete!');
        console.log('\nTo generate icons:');
        console.log('1. Install dependencies: npm install');
        console.log('2. Generate icons: npm run build:icons');
        console.log('\nTo run locally: npm start');
        
    } catch (error) {
        console.error('Setup error:', error);
    }
}

// Check if this is the main module
if (require.main === module) {
    if (process.argv.includes('--setup')) {
        setupProject();
    } else {
        generateIcons();
    }
}