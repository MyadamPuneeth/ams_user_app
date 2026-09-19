import { embedded, migrate, seed } from './database.mjs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

if (process.env.NODE_ENV === 'production') throw new Error('The local preview runner cannot run in production.');
const testMode = process.argv.includes('--test');
// Browser test runs need an isolated port so a stopped/parallel preview cannot block Playwright.
const database = await embedded({ port: testMode ? 57000 + Math.floor(Math.random() * 1000) : 55432, directory: testMode ? `.local/e2e-${Date.now()}` : '.local/postgres' });
const children = [];
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  await database.server.stop();
  process.exit(code);
}
process.on('SIGINT', () => void stop());
process.on('SIGTERM', () => void stop());
function run(command, args, extra = {}) {
  const child = spawn(command, args, { stdio: 'inherit', windowsHide: true, env: { ...process.env, ...extra } });
  children.push(child);
  child.on('error', error => { console.error(error.message); void stop(1); });
  return child;
}
try {
  await migrate(database.adminUrl);
  await seed(database.adminUrl);
  console.log('Local PostgreSQL ready. Preview data stays in .local/postgres.');
  const apiEnv = { DATABASE_URL: database.appUrl, NODE_ENV: testMode ? 'test' : 'development', DEV_AUTH: 'true', PORT: '3001', WEB_ORIGIN: 'http://localhost:5173' };
  const apiArgs = ['-m', 'uv', 'run', '--project', 'apps/api', 'uvicorn', 'ams_api.main:app', '--host', '127.0.0.1', '--port', '3001'];
  if (!testMode) apiArgs.push('--reload');
  const api = run('python', apiArgs, apiEnv);
  api.on('exit', code => { if (!stopping) void stop(code || 1); });
  const web = run(process.execPath, ['node_modules/vite/bin/vite.js', '--config', 'apps/web/vite.config.ts', 'apps/web', '--host', '127.0.0.1']);
  web.on('exit', code => { if (!stopping) void stop(code || 1); });
  console.log('AMS preview: http://localhost:5173 · API docs: http://127.0.0.1:3001/api/docs');
} catch (error) { console.error(error); await stop(1); }
