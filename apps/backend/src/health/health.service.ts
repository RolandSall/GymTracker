import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  service: string;
}

@Injectable()
export class HealthService {
  getHealthStatus(): HealthStatus {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'gym-tracker-api',
    };
  }
}