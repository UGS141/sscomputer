import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   SRI SHANMUKHA COMPUTER INSTITUTE (SSCI) - SEO AUDIT   ');
console.log('====================================================\n');

let issuesFound = 0;
let passesFound = 0;

function logPass(msg) {
  console.log(`[PASS] ${msg}`);
  passesFound++;
}

function logIssue(msg) {
  console.log(`[FAIL] ${msg}`);
  issuesFound++;
}

// 1. Check Public Files
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

if (fs.existsSync(robotsPath)) {
  logPass('public/robots.txt exists.');
} else {
  logIssue('public/robots.txt is missing.');
}

if (fs.existsSync(sitemapPath)) {
  logPass('public/sitemap.xml exists.');
} else {
  logIssue('public/sitemap.xml is missing.');
}

// 2. Check SEO Config & Schemas
const seoConfigPath = path.join(rootDir, 'src', 'seo', 'config.ts');
const seoSchemasPath = path.join(rootDir, 'src', 'seo', 'schemas.ts');
const seoHeadPath = path.join(rootDir, 'src', 'seo', 'SEOHead.tsx');

if (fs.existsSync(seoConfigPath) && fs.existsSync(seoSchemasPath) && fs.existsSync(seoHeadPath)) {
  logPass('Centralized SEO framework (config, schemas, SEOHead) exists.');
} else {
  logIssue('SEO framework files missing in src/seo/.');
}

// 3. Scan Pages for SEO Integration and H1/Alt check
const pagesDir = path.join(rootDir, 'src', 'pages');
if (fs.existsSync(pagesDir)) {
  const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
  logPass(`Found ${pageFiles.length} page components to audit.`);

  pageFiles.forEach(file => {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check SEOHead usage
    if (content.includes('SEOHead')) {
      logPass(`Page ${file} implements <SEOHead /> metadata.`);
    } else {
      logIssue(`Page ${file} is missing <SEOHead /> integration.`);
    }

    // Check H1 tags count
    let totalH1 = (content.match(/<h1[^>]*>/gi) || []).length;
    if (file === 'HomePage.tsx') {
      const heroPath = path.join(rootDir, 'src', 'components', 'home', 'Hero.tsx');
      if (fs.existsSync(heroPath)) {
        const heroContent = fs.readFileSync(heroPath, 'utf-8');
        totalH1 += (heroContent.match(/<h1[^>]*>/gi) || []).length;
      }
    }

    if (totalH1 === 1) {
      logPass(`Page ${file} has exactly one H1 tag.`);
    } else if (totalH1 === 0) {
      logIssue(`Page ${file} has NO H1 tag.`);
    } else {
      logIssue(`Page ${file} has multiple (${totalH1}) H1 tags.`);
    }
  });
}

// 4. Scan Components for Images without Alt
const componentsDir = path.join(rootDir, 'src', 'components');
function scanDirForImages(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirForImages(fullPath);
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const imgTags = content.match(/<img[^>]*>/gi) || [];
      imgTags.forEach(img => {
        if (!img.includes('alt=')) {
          logIssue(`Image in ${file} missing alt attribute: ${img.slice(0, 40)}...`);
        }
      });
    }
  });
}
if (fs.existsSync(componentsDir)) {
  scanDirForImages(componentsDir);
}

console.log('\n----------------------------------------------------');
console.log(`Audit Finished: ${passesFound} Passed, ${issuesFound} Issues.`);
console.log('----------------------------------------------------\n');

if (issuesFound > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
