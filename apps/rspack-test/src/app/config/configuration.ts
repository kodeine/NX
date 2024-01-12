import { Dictionary, IPrimaryKey, Options } from '@mikro-orm/core';
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';

const logger = new Logger('MikroORM');

export const configuration = () => ({
  ormConfig: {
    // subscribers: [new UserSubscriber()],
    findOneOrFailHandler: (
      entityName: string,
      where: Dictionary | IPrimaryKey
    ) => {
      return new NotFoundException(`${entityName} not found`);
    },
    entities: [`./dist/**/*.{entity}.js`],
    entitiesTs: [`./src/**/*.{entity}.ts`],
    migrations: {
      tableName: 'migrations',
      path: 'database/migrations',
      fileName: timestamp => `${timestamp}-Migration`,
    },
    clientUrl: process.env.DATABASE_DSN,
    type: process.env.DATABASE_TYPE,
    highlighter: new MongoHighlighter(),
    // debug: process.env.NODE_ENV !== 'production',
    // tsNode: process.env.NODE_ENV !== 'production',
    logger: logger.log.bind(logger),
    autoLoadEntities: true,
    forceUtcTimezone: true,
    timezone: '-07:00',
    // ensureIndexes: true,
  } as Options,
});
