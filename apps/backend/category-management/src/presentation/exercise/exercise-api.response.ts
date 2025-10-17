import { ApiProperty } from '@nestjs/swagger';

export class TargetApiResponse {
  @ApiProperty({
    description: 'ID of the category (muscle group) targeted by the exercise',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Type of muscle group involvement',
    enum: ['Primary', 'Secondary'],
    example: 'Primary',
  })
  type: 'Primary' | 'Secondary';
}

export class ExerciseApiResponse {
  @ApiProperty({
    description: 'Unique identifier for the exercise',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the exercise',
    example: 'Bench Press',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the exercise',
    example: 'Compound chest exercise performed lying on a bench',
  })
  description: string;

  @ApiProperty({
    description: 'Type of equipment required for the exercise',
    example: 'Barbell',
  })
  equipmentType: string;

  @ApiProperty({
    description: 'List of muscle groups targeted by the exercise',
    type: [TargetApiResponse],
  })
  targets: TargetApiResponse[];

  @ApiProperty({
    description: 'Timestamp when the exercise was created',
    example: '2025-10-18T00:00:00.000Z',
  })
  createdAt: Date;
}
