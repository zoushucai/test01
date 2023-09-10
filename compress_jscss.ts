import { walk } from 'https://deno.land/std/fs/mod.ts';

import CleanCSS from 'npm:clean-css@5.3.2';
import uglify from 'npm:uglify-js@3.17.4';

async function compressFiles(path: string) {
  if (!path) {
    console.error('Invalid input. Please provide valid path.');
    return;
  }
  for await (const entry of walk(path)) {
    if (entry.isFile) {
      try {
        const filePath = entry.path;
        if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
          const code = await Deno.readTextFile(filePath);
          const result = uglify.minify(code);
          await Deno.writeTextFile(filePath, result.code);
        }
        if (entry.name.endsWith('.css')) {
          const code = await Deno.readTextFile(filePath);
          const minified = new CleanCSS().minify(code);
          await Deno.writeTextFile(filePath, minified.styles);
        }
      } catch (error) {
        console.error(`Error processing file ${entry.path}: ${error.message}`);
        return 'error';
      }
    }
  }
}

const targetDirectory = '_site/site_libs';
compressFiles(targetDirectory);
