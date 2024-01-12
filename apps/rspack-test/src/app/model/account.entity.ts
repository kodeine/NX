import { AbstractEntity } from '@beyondclicksai/core';
import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { randomUUID } from 'crypto';

export enum AccountState {
  ACTIVE = 'A',
  PENDING = 'P',
  SUSPENDED = 'S',
  DELETED = 'D',
}

@Directive(`@key(fields: "id")`)
@ObjectType()
@Entity({ tableName: 'ACCOUNTS' })
export class Account extends AbstractEntity {
  @PrimaryKey()
  _id: string = randomUUID();

  @SerializedPrimaryKey()
  @Field(() => ID)
  id: string;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Field()
  updatedAt: Date = new Date();

  @Field()
  @Property()
  @Index()
  brandName: string;

  @Index()
  @Enum({ default: AccountState.ACTIVE })
  @Field({ defaultValue: AccountState.ACTIVE })
  state?: AccountState = AccountState.ACTIVE;

  @Field(() => Int, { defaultValue: 5 })
  @Property({ type: 'number' })
  maxUsers = 5;
}
