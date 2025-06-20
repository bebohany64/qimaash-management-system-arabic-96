
const { spawn } = require('child_process');
const path = require('path');

// دالة لتشغيل أوامر النظام
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

// بناء التطبيق للإنتاج
async function buildForProduction() {
  console.log('🔨 بناء تطبيق React...');
  await runCommand('npm', ['run', 'build']);
  
  console.log('📦 بناء تطبيق Electron...');
  await runCommand('npx', ['electron-builder']);
  
  console.log('✅ تم إنشاء التطبيق بنجاح في مجلد electron-dist/');
}

// تشغيل التطبيق في وضع التطوير
async function runDev() {
  console.log('🚀 تشغيل التطبيق في وضع التطوير...');
  
  // تشغيل خادم التطوير
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  // انتظار بدء الخادم
  setTimeout(() => {
    // تشغيل Electron
    spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });
  }, 3000);
}

// تشغيل حسب المعامل المرسل
const command = process.argv[2];

if (command === 'build') {
  buildForProduction().catch(console.error);
} else if (command === 'dev') {
  runDev().catch(console.error);
} else {
  console.log('الأوامر المتاحة:');
  console.log('  npm run electron:dev  - تشغيل التطبيق في وضع التطوير');
  console.log('  npm run electron:build - بناء التطبيق للإنتاج');
}
