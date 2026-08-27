const { spawnSync } = require('child_process');

const isProduction = process.env.RENDER || process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('====================================================');
  console.log('🚀 RENDER PRODUCTION DEPLOYMENT DETECTED');
  console.log('📦 Installing backend dependencies...');
  console.log('====================================================');
  
  spawnSync('npm', ['install', '--prefix', 'admin-panel/backend'], { stdio: 'inherit', shell: true });

  console.log('====================================================');
  console.log('📡 Starting Savrion Backend Server...');
  console.log('====================================================');
  
  const result = spawnSync('node', ['admin-panel/backend/server.js'], { stdio: 'inherit', shell: true });
  process.exit(result.status || 0);
} else {
  console.log('====================================================');
  console.log('💻 LOCAL DEVELOPMENT MODE');
  console.log('====================================================');
  
  const result = spawnSync('npx', [
    'concurrently',
    '-n', 'BACKEND,WEBSITE,ADMIN',
    '-c', 'blue,cyan,green',
    'npm run dev --prefix admin-panel/backend',
    'npm run dev --prefix savrion-website',
    'npm run dev --prefix admin-panel/frontend'
  ], { stdio: 'inherit', shell: true });
  process.exit(result.status || 0);
}
