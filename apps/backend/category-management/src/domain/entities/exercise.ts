import { EquipmentType, Target } from '../value-objects';

export class Exercise {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly equipmentType: EquipmentType,
    public readonly targets: Target[],
    public readonly createdAt: Date
  ) {}

  static create(params: {
    id: string;
    name: string;
    description: string;
    equipmentType: EquipmentType;
    targets: Target[];
  }): Exercise {
    const now = new Date();
    return new Exercise(
      params.id,
      params.name,
      params.description,
      params.equipmentType,
      params.targets,
      now
    );
  }
}
