import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { AxiosResponse } from 'axios';

export interface CategoryWorld extends World {
  response?: AxiosResponse;
  categoryId?: string;
  categoryData?: {
    name: string;
    description: string;
  };
}

class CustomWorld extends World implements CategoryWorld {
  response?: AxiosResponse;
  categoryId?: string;
  categoryData?: {
    name: string;
    description: string;
  };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
