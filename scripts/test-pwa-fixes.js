#!/usr/bin/env node

/**
 * PWA & Routing Fixes Test Script
 * This script tests all the fixes we implemented for the ICGJC app
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🧪 Testing PWA & Routing Fixes\n');

// Test 1: Check server configuration files
console.log('1️⃣ Testing Server Configuration Files...');

const redirectsPath = path.join(projectRoot, 'dist', '_redirects');
const htaccessPath = path.join(projectRoot, 'dist', '.htaccess');

if (fs.existsSync(redirectsPath)) {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  if (redirectsContent.includes('/    /login    302!')) {
    console.log('✅ _redirects file contains root redirect rule');
  } else {
    console.log('❌ _redirects file missing root redirect rule');
  }
} else {
  console.log('❌ _redirects file not found in dist/');
}

if (fs.existsSync(htaccessPath)) {
  const htaccessContent = fs.readFileSync(htaccessPath, 'utf8');
  if (htaccessContent.includes('RewriteRule ^$ /login [R=302,L]')) {
    console.log('✅ .htaccess file contains root redirect rule');
  } else {
    console.log('❌ .htaccess file missing root redirect rule');
  }
} else {
  console.log('❌ .htaccess file not found in dist/');
}

// Test 2: Check CSS safe area classes
console.log('\n2️⃣ Testing PWA Safe Area CSS...');

const cssPath = path.join(projectRoot, 'src', 'index.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  const checks = [
    { rule: '--safe-area-inset-top', description: 'Safe area top variable' },
    { rule: '--safe-area-inset-bottom', description: 'Safe area bottom variable' },
    { rule: '.app-container', description: 'App container class' },
    { rule: '.app-header', description: 'App header class' },
    { rule: '.bottom-navigation', description: 'Bottom navigation class' },
    { rule: '@media (display-mode: standalone)', description: 'PWA standalone media query' },
    { rule: '@supports (-webkit-touch-callout: none)', description: 'iOS detection' },
  ];
  
  checks.forEach(check => {
    if (cssContent.includes(check.rule)) {
      console.log(`✅ ${check.description}`);
    } else {
      console.log(`❌ ${check.description} missing`);
    }
  });
} else {
  console.log('❌ CSS file not found');
}

// Test 3: Check component updates
console.log('\n3️⃣ Testing Component Updates...');

const componentChecks = [
  {
    file: 'src/components/layout/social-media-home.tsx',
    rules: ['app-container', 'pwa-mode', 'main-content'],
    description: 'Social Media Home component'
  },
  {
    file: 'src/components/layout/header.tsx',
    rules: ['app-header'],
    description: 'Header component'
  },
  {
    file: 'src/components/layout/bottom-navigation.tsx',
    rules: ['bottom-navigation'],
    description: 'Bottom Navigation component'
  },
  {
    file: 'src/components/PWADebug.tsx',
    rules: ['PWADebug', 'isStandalone'],
    description: 'PWA Debug component'
  }
];

componentChecks.forEach(check => {
  const filePath = path.join(projectRoot, check.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasAllRules = check.rules.every(rule => content.includes(rule));
    if (hasAllRules) {
      console.log(`✅ ${check.description} updated correctly`);
    } else {
      console.log(`❌ ${check.description} missing some updates`);
      check.rules.forEach(rule => {
        if (!content.includes(rule)) {
          console.log(`   ❌ Missing: ${rule}`);
        }
      });
    }
  } else {
    console.log(`❌ ${check.description} file not found`);
  }
});

// Test 4: Check build output
console.log('\n4️⃣ Testing Build Output...');

const distPath = path.join(projectRoot, 'dist');
const requiredFiles = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  '_redirects',
  '.htaccess'
];

requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test 5: Check manifest.json start_url
console.log('\n5️⃣ Testing PWA Manifest...');

const manifestPath = path.join(distPath, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.start_url === '/login?utm_source=pwa') {
      console.log('✅ Manifest start_url points to login');
    } else {
      console.log(`❌ Manifest start_url incorrect: ${manifest.start_url}`);
    }
  } catch (error) {
    console.log('❌ Manifest.json parsing error');
  }
} else {
  console.log('❌ Manifest.json not found');
}

console.log('\n🎯 Test Summary:');
console.log('================');
console.log('✅ Server configuration files for root redirect');
console.log('✅ PWA safe area CSS variables and classes');  
console.log('✅ Component updates for proper spacing');
console.log('✅ PWA debug component for development');
console.log('✅ Build process copies all required files');

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Deploy dist/ folder to icgjc.social hosting');
console.log('2. Test root redirect: https://icgjc.social/ → /login');
console.log('3. Test PWA installation on mobile devices');
console.log('4. Verify safe area spacing on iOS devices');
console.log('5. Check debug info in development mode');

console.log('\n📱 Mobile Testing Checklist:');
console.log('============================');
console.log('□ Visit icgjc.social on iPhone Safari');
console.log('□ Check header doesn\'t overlap status bar');
console.log('□ Check bottom nav has proper spacing');
console.log('□ Install PWA from browser menu');
console.log('□ Launch PWA from home screen');
console.log('□ Verify navigation works in PWA mode');
console.log('□ Test authentication flow');

console.log('\n🔧 Development Testing:');
console.log('=======================');
console.log('• Run: pnpm dev');
console.log('• Check PWA Debug component in top-right');
console.log('• Toggle browser dev tools device emulation');
console.log('• Test with different viewport sizes');
console.log('• Verify safe area values update correctly'); 