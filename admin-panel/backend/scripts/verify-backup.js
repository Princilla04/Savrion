const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const backupRoot = path.resolve(__dirname, '../backups');

/** Finds the most recent timestamped backup directory. */
const getLatestBackup = () => fs.readdirSync(backupRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort().pop();

/** Verifies backup checksums and ensures JSON datastore files still parse. */
const verifyBackup = () => {
  const latestBackup = getLatestBackup();
  if (!latestBackup) throw new Error('No backup exists. Run npm run backup first.');
  const directory = path.join(backupRoot, latestBackup);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
  manifest.files.forEach((file) => {
    const fullPath = path.join(directory, file.path);
    const digest = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
    if (digest !== file.sha256) throw new Error(`Checksum mismatch: ${file.path}`);
    if (file.path.startsWith('json-data') && file.path.endsWith('.json')) JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  });
  console.log(`[Backup] ${latestBackup} verified successfully (${manifest.files.length} files).`);
};

try { verifyBackup(); } catch (error) { console.error(`[Backup] Verification failed: ${error.message}`); process.exitCode = 1; }
