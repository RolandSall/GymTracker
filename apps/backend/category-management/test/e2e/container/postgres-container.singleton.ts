import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql';
import * as process from "node:process";
import {Pool} from 'pg';
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import * as schema from "../../../src/infrastructure/persistence";

let pool: Pool;
let db: NodePgDatabase<typeof schema>;

export class PostgresContainerSingleton {
  private static instance: PostgresContainerSingleton;
  private container: StartedPostgreSqlContainer | null = null;

  private constructor() {}

  public static getInstance(): PostgresContainerSingleton {
    if (!PostgresContainerSingleton.instance) {
      PostgresContainerSingleton.instance = new PostgresContainerSingleton();
    }
    return PostgresContainerSingleton.instance;
  }

  public async start(): Promise<StartedPostgreSqlContainer> {
    if (this.container) {
      return this.container;
    }

    this.container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    process.env.DATABASE_URL = this.container.getConnectionUri();
    return this.container;
  }

  public async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }

  public getContainer(): StartedPostgreSqlContainer | null {
    return this.container;
  }
}
