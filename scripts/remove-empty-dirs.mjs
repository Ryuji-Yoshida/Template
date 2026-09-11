import { readdir, rmdir } from 'node:fs/promises';
import path from 'node:path';

async function removeEmptyDirectories(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(path.join(directory, entry.name));
    }
  }

  if ((await readdir(directory)).length === 0) {
    await rmdir(directory);
  }
}

await removeEmptyDirectories(path.resolve('dist'));