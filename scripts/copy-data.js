#!/usr/bin/env node

/**
 * Copy data directory to build directory
 * Handles special characters correctly on Windows
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../data');
const TARGET_DIR = path.join(__dirname, '../build/data');

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  // Create destination if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file as binary to avoid encoding issues
      const content = fs.readFileSync(srcPath);
      fs.writeFileSync(destPath, content);
    }
  }
}

/**
 * Main function
 */
function main() {
  console.log('Copying data directory to build...');

  // Remove existing build/data if it exists
  if (fs.existsSync(TARGET_DIR)) {
    fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  }

  // Copy data directory
  copyDirectory(SOURCE_DIR, TARGET_DIR);

  console.log('Done!');
}

main();
