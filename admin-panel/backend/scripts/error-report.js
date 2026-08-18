const fs = require('fs');
const path = require('path');
const errorLogPath = path.resolve(__dirname, '../logs/errors.log');
const since = Date.now() - (24 * 60 * 60 * 1000);

/** Summarizes API errors logged within the previous 24 hours. */
const reportErrors = () => {
  if (!fs.existsSync(errorLogPath)) { console.log('[Monitoring] No error log exists yet.'); return; }
  const errors = fs.readFileSync(errorLogPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line)).filter((entry) => new Date(entry.timestamp).getTime() >= since);
  console.log(`[Monitoring] ${errors.length} API errors recorded in the last 24 hours.`);
  if (errors.length > 0) process.exitCode = 1;
};

reportErrors();
