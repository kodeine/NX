import { AppHealthCheckModule, CoreModule } from '@beyondclicksai/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configSchema, configuration } from './config';
import { Account } from './model/account.entity';
import { User } from './model/user.entity';
import { UserResolver, AccountRef } from './resolvers/user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { BigIntResolver, UUIDResolver } from 'graphql-scalars';
import * as GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        playground: config.get<string>('NODE_ENV') === 'local',
        autoTransformHttpErrors: config.get<string>('NODE_ENV') === 'local',
        resolvers: {
          BigInt: BigIntResolver,
          UUID: UUIDResolver,
          JSON: GraphQLJSON,
        },
        autoSchemaFile: {
          federation: 2,
        },
        // buildSchemaOptions: {
        //   orphanedTypes: [AccountRef],
        // },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: `./.env.${process.env.NODE_ENV || 'local'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: configSchema,
      load: [configuration],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('ormConfig'),
    }),
    MikroOrmModule.forFeature([Account, User]),
    AppHealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserResolver],
})
export class AppModule {}
