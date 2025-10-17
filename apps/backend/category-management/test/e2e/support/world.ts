import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { AxiosResponse } from 'axios';

export interface CategoryWorld extends World {
  response?: AxiosResponse;

  categoriesByName: Map<string, { id: string; name: string; description: string }>;

  expectedExercise?: {
    name: string;
    description: string;
    equipmentType: string;
    targets: Array<{ categoryName: string; type: string }>;
  };
  createdExerciseId?: string;

  fetchedExercises?: any[];
  fetchedCategories?: any[];
}

class CustomWorld extends World implements CategoryWorld {
  response?: AxiosResponse;
  categoriesByName: Map<string, { id: string; name: string; description: string }>;
  expectedExercise?: {
    name: string;
    description: string;
    equipmentType: string;
    targets: Array<{ categoryName: string; type: string }>;
  };
  createdExerciseId?: string;
  fetchedExercises?: any[];
  fetchedCategories?: any[];

  constructor(options: IWorldOptions) {
    super(options);
    this.categoriesByName = new Map();
  }
}

setWorldConstructor(CustomWorld);
