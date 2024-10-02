import {
  Parent,
  ResolveField,
  Resolver,
  ResolveReference
} from '@nestjs/graphql';

import { User } from '../model/user.entity';

import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class AccountRef {
  @Directive('@external')
  @Field(() => ID)
  id!: string;
}

@Resolver(() => User)
export class UserResolver {
  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: string }) {
  //   const user = new User();
  //   user.id = '1';
  //   user.first = 'john';
  //   user.last = 'cena';

  //   return [user];
  // }

  @ResolveField(() => AccountRef)
  account(@Parent() user: User) {
    return { __typename: 'AccountRef', id: user.id };
  }
}
