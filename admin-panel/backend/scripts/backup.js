const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const backendRoot = path.resolve(__dirname, '..');
const backupRoot = path.join(backendRoot, 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDirectory = path.join(backupRoot, timestamp);

/** Copies a directory recursively when a backup source is available. */
const copyDirectory = (source, destination) => {
  if (fs.existsSync(source)) fs.cpSync(source, destination, { recursive: true });
};

/** Creates checksums for all backed-up files so integrity can be verified later. */
const createManifest = (directory) => fs.readdirSync(directory, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name !== 'manifest.json')
  .map((entry) => {
    const fullPath = path.join(entry.parentPath, entry.name);
    return { path: path.relative(directory, fullPath), sha256: crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex') };
  });

/** Creates a timestamped database backup for MongoDB or the JSON fallback datastore. */
const runBackup = () => {
  fs.mkdirSync(backupDirectory, { recursive: true });
  let mongoBackedUp = false;
  if (process.env.MONGO_URI) {
    const result = spawnSync('mongodump', ['--uri', process.env.MONGO_URI, '--out', path.join(backupDirectory, 'mongodb')], { stdio: 'inherit' });
    mongoBackedUp = !result.error && result.status === 0;
  }
  copyDirectory(path.join(backendRoot, 'data'), path.join(backupDirectory, 'json-data'));
  const manifest = { createdAt: new Date().toISOString(), mongoBackedUp, files: createManifest(backupDirectory) };
  fs.writeFileSync(path.join(backupDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`[Backup] Created ${backupDirectory}${mongoBackedUp ? ' (MongoDB + JSON)' : ' (JSON datastore)'}.`);
};

runBackup();
