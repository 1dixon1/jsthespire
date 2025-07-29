const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building JS The Spire Desktop Version...\n');

try {
    // Step 1: Build web version
    console.log('📦 Step 1: Building web version...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Web version built successfully\n');

    // Step 2: Generate icons
    console.log('🎨 Step 2: Generating icons...');
    execSync('node scripts/generate-icons.js', { stdio: 'inherit' });
    console.log('✅ Icons generated successfully\n');

    // Step 3: Build desktop version
    console.log('🖥️  Step 3: Building desktop version...');
    execSync('cd electron && npm run build-electron', { stdio: 'inherit' });
    console.log('✅ Desktop version built successfully\n');

    // Step 4: Check output
    const distPath = path.join(__dirname, '..', 'electron', 'dist');
    if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        console.log('📁 Build output files:');
        files.forEach(file => {
            const filePath = path.join(distPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const size = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`   📄 ${file} (${size} MB)`);
            } else {
                console.log(`   📁 ${file}/`);
            }
        });
    }

    console.log('\n🎉 Desktop build completed successfully!');
    console.log('📂 Check the electron/dist/ folder for the built application.');
    
} catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
} 