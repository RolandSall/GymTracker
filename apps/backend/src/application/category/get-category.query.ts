import { IQuery } from '@gym-tracker/nest-mediator';

export class GetCategoryQuery implements IQuery {
  constructor(public readonly id: string) {}
}
