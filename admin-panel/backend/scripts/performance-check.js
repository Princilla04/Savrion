const http = require('http');
const url = process.env.HEALTH_CHECK_URL || 'http://localhost:5050/api/health';
const startedAt = Date.now();

/** Measures the API health endpoint response time for the weekly performance check. */
const requestHealth = () => {
  http.get(url, (response) => {
    response.resume();
    const duration = Date.now() - startedAt;
    if (response.statusCode !== 200 || duration > 1500) { console.error(`[Performance] Health check failed: ${response.statusCode} in ${duration}ms.`); process.exitCode = 1; return; }
    console.log(`[Performance] Health check passed: ${response.statusCode} in ${duration}ms.`);
  }).on('error', (error) => { console.error(`[Performance] Health check error: ${error.message}`); process.exitCode = 1; });
};

requestHealth();
