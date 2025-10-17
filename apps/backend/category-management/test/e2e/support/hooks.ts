import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../../../src/infrastructure/persistence/index';
import { categories } from '../../../src/infrastructure/persistence/category/category.entity';
import axios, { AxiosInstance } from 'axios';
import { spawn, ChildProcess } from 'child_process';
import { join, resolve } from 'path';
import { PostgresContainerSingleton } from '../container/postgres-container.singleton';

setDefaultTimeout(180000);

const postgresContainer = PostgresContainerSingleton.getInstance();
let pool: Pool;
let db: NodePgDatabase<typeof schema>;
let apiClient: AxiosInstance;
let backendProcess: ChildProcess;
let nestAppPid: number | undefined;

export function getDb(): NodePgDatabase<typeof schema> {
  return db;
}

export function getApiClient(): AxiosInstance {
  return apiClient;
}

BeforeAll(async function () {
  await postgresContainer.start();

  const connectionString = postgresContainer.getContainer().getConnectionUri();


  pool = new Pool({ connectionString });
  db = drizzle(pool);

  console.log('Running migrations...');
  const migrationsFolder = resolve(__dirname, '../../../../resources/migrations');
  await migrate(db, { migrationsFolder });

  console.log('Starting backend application...');
  const rootDir = join(__dirname, '../../../../../..');
  backendProcess = spawn('npm', ['run', 'backend:e2e'], {
    cwd: rootDir,
    env: { ...process.env, DATABASE_URL: connectionString },
    stdio: 'pipe',
    shell: true
  });

  // Wait for backend to start
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Backend failed to start')), 60000);

    backendProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Backend:', output);

      // Extract the NestJS process PID from the log output
      const pidMatch = output.match(/\[Nest\] (\d+)/);
      if (pidMatch && !nestAppPid) {
        nestAppPid = parseInt(pidMatch[1], 10);
        console.log(`Captured NestJS PID: ${nestAppPid}`);
      }

      if (output.includes('Application is running')) {
        clearTimeout(timeout);
        resolve(undefined);
      }
    });

    backendProcess.stderr?.on('data', (data) => {
      const errorOutput = data.toString();
      // Filter out expected NX and debugger messages
      if (!errorOutput.includes('Debugger listening') &&
          !errorOutput.includes('For help, see:') &&
          !errorOutput.includes('Build failed')) {
        console.error('Backend Error:', errorOutput);
      }
    });

    backendProcess.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });


  apiClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000/api',
    validateStatus: () => true, // Don't throw on any status
  });
});

AfterAll(async function () {

  if (pool) {
    await pool.end();
  }

  // Stop the backend gracefully
  if (nestAppPid) {
    console.log(`Stopping NestJS application (PID: ${nestAppPid}) gracefully...`);
    try {
      process.kill(nestAppPid, 'SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.log('NestJS process already stopped');
    }
  }

  // Stop the NX process
  // if (backendProcess) {
  //   console.log('Stopping NX process...');
  //   backendProcess.kill('SIGTERM');
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   console.log('Backend stopped');
  // }

  await postgresContainer.stop();
  console.log('Cleanup completed');
});

Before(async function () {
  if (db) {
    await db.delete(categories);
  }
});

After(async function (scenario) {
  // Print scenario result with name
  const status = scenario.result?.status || 'unknown';
  console.log(`\nScenario: ${scenario.pickle.name} - ${status.toUpperCase()}`);
});
