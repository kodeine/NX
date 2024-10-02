import { AbstractEntity } from '@beyondclicksai/core';
import { Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { randomUUID } from 'crypto';

@ObjectType({ isAbstract: true })
@Directive(`@key(fields: "id")`)
@Entity({ tableName: 'USERS' })
export class User extends AbstractEntity {
  @PrimaryKey()
  _id: string = randomUUID();

  @SerializedPrimaryKey()
  @Field(() => ID)
  id: string;


  @Property()
  @Field()
  first!: string;

  @Property()
  @Field()
  last!: string;

  @Property({ persist: false, type: String })
  get name() {
    return `${this.first} ${this.last}`;
  }
}
