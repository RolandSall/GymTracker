import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { eq } from 'drizzle-orm';
import { getDb, getApiClient } from '../support/hooks';
import { categories } from '../../../src/infrastructure/persistence';
import { CategoryWorld } from '../support/world';

Given(
  'the user wants to create a muscle group category for {string}',
  function (this: CategoryWorld, categoryName: string) {
    this.categoriesByName.set(categoryName, {
      id: '', // Will be filled after creation
      name: categoryName,
      description: `Muscle group focusing on ${categoryName.toLowerCase()} development and strength`,
    });
  }
);

When('the category is created through the system', async function (this: CategoryWorld) {
  const apiClient = getApiClient();

  const categoryEntry = Array.from(this.categoriesByName.entries())[0];
  const [categoryName, categoryData] = categoryEntry;

  const response = await apiClient.post('/categories', {
    name: categoryData.name,
    description: categoryData.description,
  });

  expect(response.status).to.equal(201, 'Category should be created successfully');
});

Then(
  'the {string} category should be available for organizing exercises',
  async function (this: CategoryWorld, categoryName: string) {
    const db = getDb();

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.name, categoryName))
      .limit(1);

    expect(result).to.have.lengthOf(1, `Category "${categoryName}" should exist in database`);

    const storedCategory = result[0];
    const expectedCategory = this.categoriesByName.get(categoryName);

    expect(storedCategory.name).to.equal(expectedCategory!.name);
    expect(storedCategory.description).to.equal(expectedCategory!.description);
    expect(storedCategory.createdAt).to.exist;
    expect(storedCategory.id).to.exist;

    this.categoriesByName.set(categoryName, {
      ...expectedCategory!,
      id: storedCategory.id,
    });
  }
);
