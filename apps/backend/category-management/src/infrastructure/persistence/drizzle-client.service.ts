import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './index';

@Injectable()
export class DrizzleClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private _db: NodePgDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('database.url');
    this.pool = new Pool({
      connectionString: databaseUrl,
    });

    this._db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  get db(): NodePgDatabase<typeof schema> {
    return this._db;
  }
}
