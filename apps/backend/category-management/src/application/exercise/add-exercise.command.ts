import { ICommand } from '@rolandsall24/nest-mediator';
import { EquipmentType } from '../../domain/value-objects';

export interface TargetDto {
  categoryId: string;
  type: 'Primary' | 'Secondary';
}

export class AddExerciseCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly equipmentType: EquipmentType,
    public readonly targets: TargetDto[]
  ) {}
}
