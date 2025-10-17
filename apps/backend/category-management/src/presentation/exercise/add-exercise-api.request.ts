import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TargetApiRequest {
  @ApiProperty({
    description: 'ID of the category (muscle group) targeted by the exercise',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Type of muscle group involvement',
    enum: ['Primary', 'Secondary'],
    example: 'Primary',
  })
  @IsEnum(['Primary', 'Secondary'])
  @IsNotEmpty()
  type: 'Primary' | 'Secondary';
}

export class AddExerciseApiRequest {
  @ApiProperty({
    description: 'Name of the exercise',
    example: 'Bench Press',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the exercise',
    example: 'Compound chest exercise performed lying on a bench',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Type of equipment required for the exercise',
    enum: ['Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Band', 'Kettlebell', 'Other'],
    example: 'Barbell',
  })
  @IsEnum(['Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Band', 'Kettlebell', 'Other'])
  @IsNotEmpty()
  equipmentType: 'Barbell' | 'Dumbbell' | 'Bodyweight' | 'Machine' | 'Cable' | 'Band' | 'Kettlebell' | 'Other';

  @ApiProperty({
    description: 'List of muscle groups targeted by the exercise. Must include exactly one Primary muscle group.',
    type: [TargetApiRequest],
    example: [
      { categoryId: '550e8400-e29b-41d4-a716-446655440000', type: 'Primary' },
      { categoryId: '660e8400-e29b-41d4-a716-446655440001', type: 'Secondary' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TargetApiRequest)
  targets: TargetApiRequest[];
}
