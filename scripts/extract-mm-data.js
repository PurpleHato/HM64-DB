#!/usr/bin/env node

/**
 * MM Data Extraction Script
 * Extracts data from MM Decomp XML files to generate JSON database files
 * Similar to existing OOT data structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MM_DECOMP_BASE = '//wsl.localhost/Debian/home/purplehato/mm/assets/xml';
const MM_2S2H_XML_BASE = 'C:/Users/PurpleHato/Downloads/2ship2harkinian-develop (1)/2ship2harkinian-develop/mm/assets/xml/GC_US';
const MM_2S2H_SRC_BASE = 'C:/Users/PurpleHato/Downloads/2ship2harkinian-develop (1)/2ship2harkinian-develop/mm/src';
const OUTPUT_BASE = path.join(__dirname, '../data/MM');

// Initialize XML parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '#text',
  parseAttributeValue: true,
  parseTagValue: true,
  trimValues: true,
});

// Ensure output directories exist
function ensureDir(dirPath) {
  const fullPath = path.join(OUTPUT_BASE, dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// Read XML file
function readXML(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return parser.parse(content);
  } catch (e) {
    console.warn(`Failed to read ${filePath}: ${e.message}`);
    return null;
  }
}

// Get all XML files from a directory
function getXMLFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(f => f.endsWith('.xml')).map(f => path.join(dirPath, f));
  } catch (e) {
    console.warn(`Failed to list directory ${dirPath}: ${e.message}`);
    return [];
  }
}

// Store descriptions from various sources
const descriptionCache = new Map();

// Extract description from XML comments
function extractDescriptionFromXMLComment(xmlContent, elementName) {
  // Look for comments before the element
  const commentPattern = new RegExp(`<!--\\s*([^>]+?)\\s*-->[\\s\\S]*?<(?:DList|Skeleton|Animation)\\s+Name="${elementName}"`, 'i');
  const match = xmlContent.match(commentPattern);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
}

// Build description cache from XML comments
function buildDescriptionCache() {
  console.log('Building description cache from XML comments...');

  // Process objects
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Find all DList elements with preceding comments
      const dlMatches = content.matchAll(/<!--\s*([^>]+?)\s*-->[\s\S]*?<DList\s+Name="([^"]+)"/g);
      for (const match of dlMatches) {
        descriptionCache.set(match[2], match[1].trim());
      }

      // Find all Skeleton elements with preceding comments
      const skMatches = content.matchAll(/<!--\s*([^>]+?)\s*-->[\s\S]*?<Skeleton\s+Name="([^"]+)"/g);
      for (const match of skMatches) {
        descriptionCache.set(match[2], match[1].trim());
      }

      // Find all Animation elements with preceding comments
      const animMatches = content.matchAll(/<!--\s*([^>]+?)\s*-->[\s\S]*?<Animation\s+Name="([^"]+)"/g);
      for (const match of animMatches) {
        descriptionCache.set(match[2], match[1].trim());
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }

  console.log(`  Cached ${descriptionCache.size} descriptions from XML comments`);
}

// Get description for an element
function getDescription(elementName) {
  return descriptionCache.get(elementName) || '';
}

// Extract descriptions from 2S2H source files
function extractDescriptionsFromSource() {
  console.log('Extracting descriptions from 2S2H source files...');

  if (!fs.existsSync(MM_2S2H_SRC_BASE)) {
    console.log('  Warning: 2S2H source path not accessible');
    return;
  }

  let count = 0;

  // Recursively find all C and H files
  function findSourceFiles(dir, results = []) {
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findSourceFiles(fullPath, results);
      } else if (entry.isFile() && (entry.name.endsWith('.c') || entry.name.endsWith('.h'))) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const sourceFiles = findSourceFiles(MM_2S2H_SRC_BASE);

  for (const filePath of sourceFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Look for lines with asset names followed by descriptions
      lines.forEach(line => {
        // Match patterns like: gAssetName // Description
        const assetMatch = line.match(/(g\w+(?:DL|Skel|Anim))\s*(?:\/\*\s*(.*?)\s*\*\/)?\s*(?:\/\/\s*(.*))?/);
        if (assetMatch) {
          const assetName = assetMatch[1];
          const desc = (assetMatch[2] || assetMatch[3] || '').trim();

          if (desc && desc.length > 3 && !descriptionCache.has(assetName)) {
            descriptionCache.set(assetName, desc);
            count++;
          }
        }
      });
    } catch (e) {
      // Skip files that can't be read
    }
  }

  console.log(`  Extracted ${count} descriptions from source files`);
}

// Extract Objects.json from objects/*.xml
function extractObjects() {
  console.log('Extracting Objects.json...');
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  const results = [];

  for (const filePath of files) {
    const xml = readXML(filePath);
    if (!xml || !xml.Root || !xml.Root.File) continue;

    const fileName = path.basename(filePath, '.xml');
    const dir = `objects/${fileName}`;

    // Read content for XML comment extraction
    const xmlContent = fs.readFileSync(filePath, 'utf8');

    const processFile = (file) => {
      const dLists = file.DList;
      if (Array.isArray(dLists)) {
        dLists.forEach(dl => {
          const desc = getDescription(dl.Name) || extractDescriptionFromXMLComment(xmlContent, dl.Name);
          results.push({
            'Decomp Directory': dir,
            'Decomp File Name (For Import)': dl.Name,
            'Description': desc,
            'SoH Directory': dir,
            'SoH Name (For Export)': dl.Name
          });
        });
      } else if (dLists && typeof dLists === 'object') {
        const desc = getDescription(dLists.Name) || extractDescriptionFromXMLComment(xmlContent, dLists.Name);
        results.push({
          'Decomp Directory': dir,
          'Decomp File Name (For Import)': dLists.Name,
          'Description': desc,
          'SoH Directory': dir,
          'SoH Name (For Export)': dLists.Name
        });
      }
    };

    // Handle single File
    const file = xml.Root.File;
    if (Array.isArray(file)) {
      file.forEach(processFile);
    } else {
      processFile(file);
    }
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/Objects.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} objects`);
}

// Extract Scenes.json from scenes/*/*_room_*.xml
function extractScenes() {
  console.log('Extracting Scenes.json...');
  const scenesDir = path.join(MM_DECOMP_BASE, 'scenes');
  const sceneFolders = fs.readdirSync(scenesDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

  const results = [];

  for (const sceneName of sceneFolders) {
    const scenePath = path.join(scenesDir, sceneName);

    // Check for individual room files or scene.xml
    const entries = fs.readdirSync(scenePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.xml')) {
        const filePath = path.join(scenePath, entry.name);
        const xml = readXML(filePath);
        if (!xml || !xml.Root) continue;

        const dir = `scenes/${sceneName}`;
        const processFile = (file) => {
          const dLists = file.DList;
          if (Array.isArray(dLists)) {
            dLists.forEach(dl => {
              results.push({
                'Decomp Directory': dir,
                'Decomp File Name (For Import)': dl.Name,
                'SoH Directory': dir,
                'SoH Name (For Export)': dl.Name,
                'Description': ''
              });
            });
          } else if (dLists && typeof dLists === 'object') {
            results.push({
              'Decomp Directory': dir,
              'Decomp File Name (For Import)': dLists.Name,
              'SoH Directory': dir,
              'SoH Name (For Export)': dLists.Name,
              'Description': ''
            });
          }
        };

        const file = xml.Root.File;
        if (Array.isArray(file)) {
          file.forEach(processFile);
        } else if (file) {
          processFile(file);
        }
      }
    }
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/Scenes.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} scenes`);
}

// Extract Skeletons.json from objects/*.xml
function extractSkeletons() {
  console.log('Extracting Skeletons.json...');
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  const results = [];

  for (const filePath of files) {
    const xml = readXML(filePath);
    if (!xml || !xml.Root || !xml.Root.File) continue;

    const fileName = path.basename(filePath, '.xml');
    const dir = `objects/${fileName}`;

    // Read content for XML comment extraction
    const xmlContent = fs.readFileSync(filePath, 'utf8');

    const processFile = (file) => {
      const skeletons = file.Skeleton;
      if (Array.isArray(skeletons)) {
        skeletons.forEach(sk => {
          const desc = getDescription(sk.Name) || extractDescriptionFromXMLComment(xmlContent, sk.Name);
          results.push({
            'Decomp Directory': dir,
            'Decomp File Name (For Import)': sk.Name,
            'Description': desc,
            'SoH Directory': dir,
            'SoH Name (For Export)': sk.Name
          });
        });
      } else if (skeletons && typeof skeletons === 'object') {
        const desc = getDescription(skeletons.Name) || extractDescriptionFromXMLComment(xmlContent, skeletons.Name);
        results.push({
          'Decomp Directory': dir,
          'Decomp File Name (For Import)': skeletons.Name,
          'Description': desc,
          'SoH Directory': dir,
          'SoH Name (For Export)': skeletons.Name
        });
      }
    };

    const file = xml.Root.File;
    if (Array.isArray(file)) {
      file.forEach(processFile);
    } else {
      processFile(file);
    }
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/Skeletons.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} skeletons`);
}

// Extract SkeletonsBones.json from skeleton data
// MM XML has Limb elements as siblings to Skeleton, not nested inside
function extractSkeletonsBones() {
  console.log('Extracting SkeletonsBones.json...');
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  const results = [];

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.xml');
      const dir = `objects/${fileName}`;

      // Find all Skeleton elements and their associated Limbs
      // In MM XML, Limbs come BEFORE the Skeleton element
      const skeletonMatches = content.matchAll(/<Skeleton\s+Name="([^"]+)"/g);

      for (const match of skeletonMatches) {
        const skelName = match[1];
        const skelIndex = match.index;

        // Look for Limb elements that come before this Skeleton
        // Get text from the start of the File section to this skeleton
        const fileStart = content.indexOf('<File');
        if (fileStart === -1) continue;

        const sectionContent = content.substring(fileStart, skelIndex);

        // Find all Limb elements in this section
        const limbMatches = sectionContent.matchAll(/<Limb\s+Name="([^"]+)"/g);

        for (const limbMatch of limbMatches) {
          const limbName = limbMatch[1];
          results.push({
            'Decomp Skel Name (For Import)': skelName,
            'SoH Skel Name (For Export)': skelName,
            'Bone Name': limbName,
            'Description': ''
          });
        }
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/SkeletonsBones.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} skeleton bones`);
}

// Extract Others.json from overlays/*.xml and code/*.xml
function extractOthers() {
  console.log('Extracting Others.json...');
  const results = [];

  // Process overlays
  const overlaysDir = path.join(MM_DECOMP_BASE, 'overlays');
  const overlayFiles = getXMLFiles(overlaysDir);

  for (const filePath of overlayFiles) {
    const xml = readXML(filePath);
    if (!xml || !xml.Root || !xml.Root.File) continue;

    const fileName = path.basename(filePath, '.xml');
    const dir = `overlays/${fileName}`;

    const processFile = (file) => {
      const dLists = file.DList;
      if (Array.isArray(dLists)) {
        dLists.forEach(dl => {
          results.push({
            'Decomp Directory': dir,
            'Decomp File Name (For Import)': dl.Name,
            'SoH Directory': dir,
            'SoH Name (For Export)': dl.Name,
            'Description': ''
          });
        });
      } else if (dLists && typeof dLists === 'object') {
        results.push({
          'Decomp Directory': dir,
          'Decomp File Name (For Import)': dLists.Name,
          'SoH Directory': dir,
          'SoH Name (For Export)': dLists.Name,
          'Description': ''
        });
      }
    };

    const file = xml.Root.File;
    if (Array.isArray(file)) {
      file.forEach(processFile);
    } else if (file) {
      processFile(file);
    }
  }

  // Process code directory
  const codeDir = path.join(MM_DECOMP_BASE, 'code');
  if (fs.existsSync(codeDir)) {
    const codeFiles = getXMLFiles(codeDir);

    for (const filePath of codeFiles) {
      const xml = readXML(filePath);
      if (!xml || !xml.Root || !xml.Root.File) continue;

      const fileName = path.basename(filePath, '.xml');
      const dir = `code/${fileName}`;

      const processFile = (file) => {
        const dLists = file.DList;
        if (Array.isArray(dLists)) {
          dLists.forEach(dl => {
            results.push({
              'Decomp Directory': dir,
              'Decomp File Name (For Import)': dl.Name,
              'SoH Directory': dir,
              'SoH Name (For Export)': dl.Name,
              'Description': ''
            });
          });
        } else if (dLists && typeof dLists === 'object') {
          results.push({
            'Decomp Directory': dir,
            'Decomp File Name (For Import)': dLists.Name,
            'SoH Directory': dir,
            'SoH Name (For Export)': dLists.Name,
            'Description': ''
          });
        }
      };

      const file = xml.Root.File;
      if (Array.isArray(file)) {
        file.forEach(processFile);
      } else if (file) {
        processFile(file);
      }
    }
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/Others.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} other DLists`);
}

// Extract Animations.json from objects/*.xml
function extractAnimations() {
  console.log('Extracting Animations.json...');
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  const results = [];

  for (const filePath of files) {
    const xml = readXML(filePath);
    if (!xml || !xml.Root || !xml.Root.File) continue;

    const fileName = path.basename(filePath, '.xml');
    const dir = `objects/${fileName}`;

    // Read content for XML comment extraction
    const xmlContent = fs.readFileSync(filePath, 'utf8');

    const processFile = (file) => {
      const animations = file.Animation;
      if (Array.isArray(animations)) {
        animations.forEach(anim => {
          const desc = getDescription(anim.Name) || extractDescriptionFromXMLComment(xmlContent, anim.Name);
          results.push({
            'Decomp Directory': dir,
            'Decomp File Name (For Import)': anim.Name,
            'SoH Directory': dir,
            'SoH Name (For Export)': anim.Name,
            'Description': desc
          });
        });
      } else if (animations && typeof animations === 'object') {
        const desc = getDescription(animations.Name) || extractDescriptionFromXMLComment(xmlContent, animations.Name);
        results.push({
          'Decomp Directory': dir,
          'Decomp File Name (For Import)': animations.Name,
          'SoH Directory': dir,
          'SoH Name (For Export)': animations.Name,
          'Description': desc
        });
      }
    };

    const file = xml.Root.File;
    if (Array.isArray(file)) {
      file.forEach(processFile);
    } else {
      processFile(file);
    }
  }

  ensureDir('Animations');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Animations/Animations.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Extracted ${results.length} animations`);
}

// Extract SegmentCalls JSONs
function extractSegmentCalls() {
  console.log('Extracting SegmentCalls...');

  // SegmentCallsObjects.json
  const objectsResults = [];
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.xml');
      const objectPath = `objects/${fileName}`;

      // Find all DLists and their associated CallDisplayList elements
      const dlMatches = content.matchAll(/<DList\s+Name="([^"]+)"/g);
      for (const match of dlMatches) {
        const dlName = match[1];
        const dlIndex = match.index;
        // Look for CallDisplayList within 500 chars before this DList
        const beforeText = content.substring(Math.max(0, dlIndex - 500), dlIndex);
        const callMatch = beforeText.match(/<CallDisplayList[^>]*>([^<]*)<\/CallDisplayList>/);

        if (callMatch) {
          objectsResults.push({
            'Object Path': objectPath,
            'Filename': dlName,
            'DisplayList Segment Call': callMatch[0],
            'Notes': ''
          });
        }
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }

  ensureDir('SegmentCalls');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'SegmentCalls/SegmentCallsObjects.json'),
    JSON.stringify(objectsResults, null, 2)
  );
  console.log(`  Extracted ${objectsResults.length} object segment calls`);

  // SegmentCallsScenes.json
  const scenesResults = [];
  const scenesDir = path.join(MM_DECOMP_BASE, 'scenes');
  const sceneFolders = fs.readdirSync(scenesDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

  for (const sceneName of sceneFolders) {
    const scenePath = path.join(scenesDir, sceneName);
    const entries = fs.readdirSync(scenePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.xml')) {
        try {
          const filePath = path.join(scenePath, entry.name);
          const content = fs.readFileSync(filePath, 'utf8');

          // Find all DLists and their associated CallDisplayList elements
          const dlMatches = content.matchAll(/<DList\s+Name="([^"]+)"/g);
          for (const match of dlMatches) {
            const dlName = match[1];
            const dlIndex = match.index;
            const beforeText = content.substring(Math.max(0, dlIndex - 500), dlIndex);
            const callMatch = beforeText.match(/<CallDisplayList[^>]*>([^<]*)<\/CallDisplayList>/);

            if (callMatch) {
              scenesResults.push({
                'Scene Path': `scenes/${sceneName}`,
                'Filename': dlName,
                'DisplayList Segment Call': callMatch[0],
                'Notes': ''
              });
            }
          }
        } catch (e) {
          // Skip files that can't be read
        }
      }
    }
  }

  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'SegmentCalls/SegmentCallsScenes.json'),
    JSON.stringify(scenesResults, null, 2)
  );
  console.log(`  Extracted ${scenesResults.length} scene segment calls`);
}

// Extract CustomsSoH.json by comparing 2S2H vs Decomp
function extractCustomsSoH() {
  console.log('Extracting CustomsSoH.json (2S2H custom assets)...');

  // First, collect all DLists from decomp
  const decompDLists = new Set();
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.matchAll(/<DList\s+Name="([^"]+)"/g);
      for (const match of matches) {
        decompDLists.add(match[1]);
      }
    } catch (e) {
      // Skip
    }
  }

  // Now collect from 2S2H and find unique ones
  const results = [];

  // Try to read from 2S2H XML path
  if (fs.existsSync(MM_2S2H_XML_BASE)) {
    const s2hObjectsDir = path.join(MM_2S2H_XML_BASE, 'objects');

    if (fs.existsSync(s2hObjectsDir)) {
      const s2hFiles = fs.readdirSync(s2hObjectsDir).filter(f => f.endsWith('.xml'));

      for (const fileName of s2hFiles) {
        const filePath = path.join(s2hObjectsDir, fileName);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const matches = content.matchAll(/<DList\s+Name="([^"]+)"/g);
          const objectName = path.basename(fileName, '.xml');

          for (const match of matches) {
            const dlName = match[1];
            if (!decompDLists.has(dlName)) {
              results.push({
                'Directory': `objects/${objectName}`,
                'DL Name': dlName,
                'Source Model File': '',
                'Description': getDescription(dlName) || '2S2H custom asset',
                'DevNotes': 'Custom asset added by 2Ship2Harkinian'
              });
            }
          }
        } catch (e) {
          // Skip
        }
      }
    }
  } else {
    console.log('  Warning: 2S2H XML path not accessible, skipping CustomsSoH extraction');
  }

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/CustomsSoH.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Found ${results.length} custom 2S2H assets`);
}

// Auto-detect SkeletonsAlt patterns
function detectSkeletonsAlt() {
  console.log('Detecting SkeletonsAlt patterns...');
  const objectsDir = path.join(MM_DECOMP_BASE, 'objects');
  const files = getXMLFiles(objectsDir);

  const skeletons = [];

  for (const filePath of files) {
    const xml = readXML(filePath);
    if (!xml || !xml.Root || !xml.Root.File) continue;

    const fileName = path.basename(filePath, '.xml');
    const dir = `objects/${fileName}`;

    const processFile = (file) => {
      const sk = file.Skeleton;
      const skeletonList = Array.isArray(sk) ? sk : (sk ? [sk] : []);

      skeletonList.forEach(skeleton => {
        skeletons.push({
          dir,
          name: skeleton.Name
        });
      });
    };

    const file = xml.Root.File;
    if (Array.isArray(file)) {
      file.forEach(processFile);
    } else {
      processFile(file);
    }
  }

  // Group by base name patterns
  const patterns = {};
  skeletons.forEach(sk => {
    // Look for common patterns like object_link_child_kokiri, object_link_child_goron, etc.
    const baseMatch = sk.dir.match(/object_\w+_(\w+)/);
    if (baseMatch) {
      const base = baseMatch[1];
      if (!patterns[base]) {
        patterns[base] = [];
      }
      patterns[base].push(sk);
    }
  });

  const results = [];

  // Generate SkeletonsAlt entries for detected variants
  Object.entries(patterns).forEach(([base, variants]) => {
    if (variants.length > 1) {
      // Found variants - use first as "matches" target
      const primary = variants[0];
      variants.slice(1).forEach(variant => {
        results.push({
          'Directory': variant.dir,
          'DL Name': variant.name,
          'Matches': primary.name,
          'Description': `Variant of ${base}`,
          'DevNotes': `Auto-detected variant pattern`
        });
      });
    }
  });

  ensureDir('Dlists');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Dlists/SkeletonsAlt.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`  Detected ${results.length} skeleton variants`);
}

// Extract sequence locations from sequence_table.h
function extractSequenceLocations() {
  console.log('Extracting sequence locations...');

  const sequencePath = '//wsl.localhost/Debian/home/purplehato/mm/include/tables/sequence_table.h';
  const locations = [];

  try {
    const content = fs.readFileSync(sequencePath, 'utf8');
    const lines = content.split('\n');

    let currentSeqId = null;
    let currentLocation = '';

    // Parse sequence definitions
    // Format: DEFINE_SEQUENCE(Sequence_X, NA_BGM_NAME, ...)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for comments with location names (usually above the DEFINE)
      const commentMatch = line.match(/\/\/\s+"([^"]+)"|\/\/\s+([^\(]+)\s+\(/);
      if (commentMatch) {
        currentLocation = (commentMatch[1] || commentMatch[2]).trim();
      }

      // Look for DEFINE_SEQUENCE
      const defineMatch = line.match(/DEFINE_SEQUENCE\s*\(\s*Sequence_(\d+),\s*NA_BGM_(\w+)/);
      if (defineMatch) {
        const seqNum = parseInt(defineMatch[1], 10);
        const bgmName = defineMatch[2];

        // Map to location name from comment or enum
        const locationName = currentLocation || bgmName.replace(/_/g, ' ');

        locations.push({
          seqId: seqNum,
          bgmName,
          location: locationName
        });

        currentLocation = '';
      }
    }

    console.log(`  Found ${locations.length} sequence locations`);
    return locations;
  } catch (e) {
    console.warn(`  Failed to read sequence_table.h: ${e.message}`);
    return [];
  }
}

// Create template files for manual data
function createTemplates() {
  console.log('Creating template files...');

  // Create a mapping of soundfont IDs to location names
  const soundfontLocations = {
    '0x00': 'Termina Field',
    '0x01': 'Clock Town',
    '0x02': 'Swamp Region',
    '0x03': 'Great Bay Region',
    '0x04': 'Mountain Region',
    '0x05': 'Ikana Region',
  };

  // Instruments.json template with actual soundfont slots
  ensureDir('Instruments');
  const instruments = [];

  // Add entries for Soundfont 0 (Termina Field) with all 128 slots
  for (let slot = 0; slot <= 127; slot++) {
    instruments.push({
      'setId': '0x00',
      'location': soundfontLocations['0x00'] || 'Unknown',
      'slot': `0x${slot.toString(16).toUpperCase()}`,
      'instrument': '',
      'category': '',
      'notes': ''
    });
  }

  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Instruments/Instruments.json'),
    JSON.stringify(instruments, null, 2)
  );

  // Percussions.json template with location info
  const percussion = [
    {
      'location': 'Termina Field (Soundfont 0)',
      'details': 'Slots 0x00-0x3F: Drum percussion'
    },
    {
      'location': 'Clock Town (Soundfont 1)',
      'details': 'TODO: Fill in percussion drum mappings'
    },
    {
      'location': 'Swamp Region (Soundfont 2)',
      'details': 'TODO: Fill in percussion drum mappings'
    },
    {
      'location': 'Great Bay Region (Soundfont 3)',
      'details': 'TODO: Fill in percussion drum mappings'
    },
    {
      'location': 'Mountain Region (Soundfont 4)',
      'details': 'TODO: Fill in percussion drum mappings'
    },
    {
      'location': 'Ikana Region (Soundfont 5)',
      'details': 'TODO: Fill in percussion drum mappings'
    }
  ];

  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Instruments/Percussions.json'),
    JSON.stringify(percussion, null, 2)
  );

  // Sounds.csv template
  ensureDir('Sounds');
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'Sounds/Sounds.csv'),
    'SoH Directory,File Name,Misc Info,Sample Rate\n' +
    'audio/samples,Sample Name,C5,32000Hz\n' +
    ',TODO: Fill in sound data from audio samples,,\n'
  );

  console.log('  Templates created');
}

// Main execution
async function main() {
  console.log('MM Data Extraction Script');
  console.log('=========================\n');

  console.log(`MM Decomp Path: ${MM_DECOMP_BASE}`);
  console.log(`2S2H XML Path: ${MM_2S2H_XML_BASE}`);
  console.log(`2S2H Source Path: ${MM_2S2H_SRC_BASE}`);
  console.log(`Output Path: ${OUTPUT_BASE}\n`);

  try {
    // Build description cache first
    buildDescriptionCache();
    extractDescriptionsFromSource();

    // Extract all data
    extractObjects();
    extractScenes();
    extractSkeletons();
    extractSkeletonsBones();
    extractOthers();
    extractAnimations();
    extractSegmentCalls();
    extractCustomsSoH();  // New: Compare 2S2H vs Decomp
    detectSkeletonsAlt();
    createTemplates();

    console.log('\n✓ Extraction complete!');
    console.log(`\nOutput files created in: ${OUTPUT_BASE}`);
  } catch (e) {
    console.error('\n✗ Extraction failed:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

main();
