import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { eq } from 'drizzle-orm';
import { getDb, getApiClient } from '../support/hooks';
import { categories } from '../../../src/infrastructure/persistence';
import { CategoryWorld } from '../support/world';

Given('I have category data with name {string} and description {string}', function (this: CategoryWorld, name: string, description: string) {
  this.categoryData = {
    name,
    description,
  };
});

When('I create the category via the API', async function (this: CategoryWorld) {
  const apiClient = getApiClient();

  this.response = await apiClient.post('/categories', this.categoryData);

  if (this.response.headers.location) {
    const locationParts = this.response.headers.location.split('/');
    this.categoryId = locationParts[locationParts.length - 1];
  }
});



Then('the category should be stored in the database', async function (this: CategoryWorld) {
  const db = getDb();

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.name, this.categoryData!.name))
    .limit(1);

  expect(result).to.have.lengthOf(1);

  this.categoryId = result[0].id;
});

Then('the stored category should have the correct name and description', async function (this: CategoryWorld) {
  const db = getDb();

  expect(this.categoryId).to.exist;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, this.categoryId!))
    .limit(1);

  expect(result).to.have.lengthOf(1);
  expect(result[0].name).to.equal(this.categoryData!.name);
  expect(result[0].description).to.equal(this.categoryData!.description);
  expect(result[0].createdAt).to.exist;
});
