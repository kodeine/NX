import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as cacheManager from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as Redis from 'ioredis';

import {
  REDIS_CACHE_SERVICE,
  RedisCacheManagerClient,
} from './cache_manager.interface';

@Module({})
export class CacheManagerModule {
  static forRoot(
    config: Redis.RedisOptions = {},
    isGlobal = true
  ): DynamicModule {
    return {
      module: CacheManagerModule,
      global: isGlobal,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_CACHE_SERVICE,
          useFactory: (
            configService: ConfigService
          ): RedisCacheManagerClient => {
            const options = {
              host: configService.get('REDIS_HOST'),
              port: +configService.get('REDIS_PORT'),
              password: configService.get('REDIS_PASS'),
              db: +configService.get('REDIS_DB') || 0,
              connectionName: configService.get('APP_NAME'),
              //
              // maxRetriesPerRequest: null,
              // enableReadyCheck: false,
              // connectTimeout: 500,
              // retryStrategy: null,
              //
              retryStrategy: (times: number) => Math.min(times * 50, 2000),
              ...config,
            };

            // @ts-ignore
            const manager = cacheManager.caching({
              store: redisStore,
              ...options,
            });

            // handle reconnects
            handleReconnects(
              configService.get('APP_NAME') as string,
              (manager as any).store.getClient()
            );

            return manager as any;
          },
          inject: [ConfigService],
        },
      ],
      exports: [REDIS_CACHE_SERVICE],
    };
  }
}

function handleReconnects(context: string, client: any) {
  const logger = new Logger(`Redis: ${context}`);

  // Listen to 'error' events to the Redis connection
  client.on('error', (error: { code: string }) => {
    if (error.code === 'ECONNRESET') {
      logger.warn('Connection to Redis Session Store timed out.');
    } else if (error.code === 'ECONNREFUSED') {
      logger.error('Connection to Redis Session Store refused!');
    } else logger.error(error);
  });

  // Listen to 'reconnecting' event to Redis
  client.on('reconnecting', () => {
    if (client.status === 'reconnecting')
      logger.warn('Reconnecting to Redis Session Store...');
    else logger.error('Error reconnecting to Redis Session Store.');
  });

  // Listen to the 'connect' event to Redis
  client.on('connect', (err: any) => {
    if (!err) logger.log('Connected to Redis Session Store!');
  });

  return client;
}
