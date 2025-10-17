import { MuscleGroupType } from './muscle-group-type';

export class Target {
  constructor(
    public readonly categoryId: string,
    public readonly type: MuscleGroupType
  ) {}

  static create(params: {
    categoryId: string;
    type: MuscleGroupType;
  }): Target {
    return new Target(params.categoryId, params.type);
  }

  isPrimary(): boolean {
    return this.type === MuscleGroupType.Primary;
  }

}
