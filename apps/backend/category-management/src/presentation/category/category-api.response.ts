import { ApiProperty } from '@nestjs/swagger';

export class CategoryApiResponse {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the muscle group category',
    example: 'Chest',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the muscle group category',
    example: 'Upper body muscle group focusing on pectoral muscles',
  })
  description: string;

  @ApiProperty({
    description: 'Timestamp when the category was created',
    example: '2025-10-18T00:00:00.000Z',
  })
  createdAt: Date;
}
