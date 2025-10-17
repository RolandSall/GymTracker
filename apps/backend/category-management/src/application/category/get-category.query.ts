import { IQuery } from '@rolandsall24/nest-mediator';

export class GetCategoryQuery implements IQuery {
  constructor(public readonly id: string) {}
}
