import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { eq } from 'drizzle-orm';
import { getDb, getApiClient } from '../support/hooks';
import { categories, exercises, exerciseTargets } from '../../../src/infrastructure/persistence';
import { CategoryWorld } from '../support/world';

function generateExerciseDescription(exerciseName: string): string {
  const descriptions: Record<string, string> = {
    'Bench Press': 'Compound chest exercise performed lying on a bench pressing weight upward',
    'Squat': 'Compound leg exercise performed by lowering and raising the body with weight',
    'Leg Curl': 'Isolation exercise targeting the hamstrings performed on a machine',
    'Deadlift': 'Full body compound exercise lifting weight from the ground to hip level',
  };
  return descriptions[exerciseName] || `Exercise targeting specific muscle groups using controlled movement`;
}



async function createCategory(world: CategoryWorld, categoryName: string) {
  const apiClient = getApiClient();
  const db = getDb();

  const categoryDescription = `Muscle group focusing on ${categoryName.toLowerCase()} development and strength`;
  await apiClient.post('/categories', {
    name: categoryName,
    description: categoryDescription,
  });

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.name, categoryName))
    .limit(1);

  expect(result).to.have.lengthOf(1, `Category "${categoryName}" should be created`);

  world.categoriesByName.set(categoryName, {
    id: result[0].id,
    name: result[0].name,
    description: result[0].description,
  });
}

Given('that a category with name {string} exists', async function (this: CategoryWorld, categoryName: string) {
  await createCategory(this, categoryName);
});

Given('a category with name {string} exists', async function (this: CategoryWorld, categoryName: string) {
  await createCategory(this, categoryName);
});


Given(
  'the user decided to create a {string} exercise using the following equipment type {string}',
  function (this: CategoryWorld, exerciseName: string, equipmentType: string) {
    this.expectedExercise = {
      name: exerciseName,
      description: generateExerciseDescription(exerciseName),
      equipmentType: equipmentType,
      targets: [],
    };
  }
);

Given(
  'this exercise is marked as {string} for {string}',
  function (this: CategoryWorld, muscleGroupType: string, categoryName: string) {
    expect(this.expectedExercise).to.exist;
    expect(this.categoriesByName.has(categoryName)).to.be.true;

    this.expectedExercise!.targets.push({
      categoryName: categoryName,
      type: muscleGroupType,
    });
  }
);

Then(
  'this exercise should be available for the user to use in their workout',
  async function (this: CategoryWorld) {
    const apiClient = getApiClient();
    const db = getDb();

    expect(this.expectedExercise).to.exist;

    const targets = this.expectedExercise!.targets.map((target) => {
      const category = this.categoriesByName.get(target.categoryName);
      expect(category).to.exist;
      return {
        categoryId: category!.id,
        type: target.type,
      };
    });

    const response = await apiClient.post('/exercises', {
      name: this.expectedExercise!.name,
      description: this.expectedExercise!.description,
      equipmentType: this.expectedExercise!.equipmentType,
      targets: targets,
    });

    expect(response.status).to.equal(201, 'Exercise should be created successfully');

    const exerciseResult = await db
      .select()
      .from(exercises)
      .where(eq(exercises.name, this.expectedExercise!.name))
      .limit(1);

    expect(exerciseResult).to.have.lengthOf(1, 'Exercise should exist in database');

    const storedExercise = exerciseResult[0];
    this.createdExerciseId = storedExercise.id;

    expect(storedExercise.name).to.equal(this.expectedExercise!.name);
    expect(storedExercise.description).to.equal(this.expectedExercise!.description);
    expect(storedExercise.equipmentType).to.equal(this.expectedExercise!.equipmentType);

    const targetResult = await db
      .select()
      .from(exerciseTargets)
      .where(eq(exerciseTargets.exerciseId, storedExercise.id));

    expect(targetResult).to.have.lengthOf(
      this.expectedExercise!.targets.length,
      'All targets should be stored'
    );

    for (const expectedTarget of this.expectedExercise!.targets) {
      const category = this.categoriesByName.get(expectedTarget.categoryName);
      const actualTarget = targetResult.find(
        (target) => target.categoryId === category!.id && target.type === expectedTarget.type
      );
      expect(actualTarget).to.exist;
    }
  }
);


Given(
  'the user created a {string} exercise with equipment {string} targeting {string} as primary',
  async function (this: CategoryWorld, exerciseName: string, equipmentType: string, primaryCategory: string) {
    const apiClient = getApiClient();

    expect(this.categoriesByName.has(primaryCategory)).to.be.true;

    const primaryCategoryData = this.categoriesByName.get(primaryCategory);
    const exerciseData = {
      name: exerciseName,
      description: generateExerciseDescription(exerciseName),
      equipmentType: equipmentType,
      targets: [
        {
          categoryId: primaryCategoryData!.id,
          type: 'Primary',
        },
      ],
    };

    await apiClient.post('/exercises', exerciseData);
  }
);

Given(
  'the user created a {string} exercise with equipment {string} targeting {string} as primary and {string} as secondary',
  async function (
    this: CategoryWorld,
    exerciseName: string,
    equipmentType: string,
    primaryCategory: string,
    secondaryCategory: string
  ) {
    const apiClient = getApiClient();

    expect(this.categoriesByName.has(primaryCategory)).to.be.true;
    expect(this.categoriesByName.has(secondaryCategory)).to.be.true;

    const primaryCategoryData = this.categoriesByName.get(primaryCategory);
    const secondaryCategoryData = this.categoriesByName.get(secondaryCategory);

    const exerciseData = {
      name: exerciseName,
      description: generateExerciseDescription(exerciseName),
      equipmentType: equipmentType,
      targets: [
        {
          categoryId: primaryCategoryData!.id,
          type: 'Primary',
        },
        {
          categoryId: secondaryCategoryData!.id,
          type: 'Secondary',
        },
      ],
    };

    await apiClient.post('/exercises', exerciseData);
  }
);


When(
  'the user fetches all exercises for the {string} category',
  async function (this: CategoryWorld, categoryName: string) {
    const apiClient = getApiClient();

    expect(this.categoriesByName.has(categoryName)).to.be.true;
    const category = this.categoriesByName.get(categoryName);

    const response = await apiClient.get(`/exercises/category/${category!.id}`);
    this.fetchedExercises = response.data;
  }
);

Then('the user should see {int} exercises available', function (this: CategoryWorld, expectedCount: number) {
  expect(this.fetchedExercises).to.exist;
  expect(this.fetchedExercises).to.have.lengthOf(expectedCount);
});

Then('all exercises should have the correct details', function (this: CategoryWorld) {
  expect(this.fetchedExercises).to.exist;

  for (const exercise of this.fetchedExercises!) {
    expect(exercise.id).to.exist;
    expect(exercise.name).to.be.a('string').and.not.empty;
    expect(exercise.description).to.be.a('string').and.not.empty;
    expect(exercise.equipmentType).to.be.a('string').and.not.empty;
    expect(exercise.targets).to.be.an('array').and.not.empty;
    expect(exercise.createdAt).to.exist;

    // Verify targets structure
    for (const target of exercise.targets) {
      expect(target.categoryId).to.exist;
      expect(target.type).to.be.oneOf(['Primary', 'Secondary']);
    }
  }
});



When('the user decides to delete the {string} exercise', async function (this: CategoryWorld, exerciseName: string) {
  const apiClient = getApiClient();
  const db = getDb();

  const result = await db
    .select()
    .from(exercises)
    .where(eq(exercises.name, exerciseName))
    .limit(1);

  expect(result).to.have.lengthOf(1, `Exercise "${exerciseName}" should exist`);
  this.createdExerciseId = result[0].id;

  const response = await apiClient.delete(`/exercises/${this.createdExerciseId}`);
  expect(response.status).to.equal(204, 'Exercise should be deleted successfully');
});

Then('the exercise should no longer be available in the system', async function (this: CategoryWorld) {
  const db = getDb();

  expect(this.createdExerciseId).to.exist;

  const result = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, this.createdExerciseId!))
    .limit(1);

  expect(result).to.have.lengthOf(0, 'Exercise should be deleted from database');
});



When('the user fetches all available categories', async function (this: CategoryWorld) {
  const apiClient = getApiClient();

  const response = await apiClient.get('/categories');
  this.fetchedCategories = response.data;
});

Then('the user should see {int} categories', function (this: CategoryWorld, expectedCount: number) {
  expect(this.fetchedCategories).to.exist;
  expect(this.fetchedCategories).to.have.lengthOf(expectedCount);
});

Then('all categories should have the correct details', function (this: CategoryWorld) {
  expect(this.fetchedCategories).to.exist;

  for (const category of this.fetchedCategories!) {
    expect(category.id).to.exist;
    expect(category.name).to.be.a('string').and.not.empty;
    expect(category.description).to.be.a('string').and.not.empty;
    expect(category.createdAt).to.exist;
  }
});


// Rename category steps
When('the user renames the category {string} to {string}', async function (this: CategoryWorld, oldName: string, newName: string) {
  const apiClient = getApiClient();

  expect(this.categoriesByName.has(oldName)).to.be.true;
  const category = this.categoriesByName.get(oldName);

  this.response = await apiClient.patch(`/categories/${category!.id}`, {
    name: newName,
  });
});

Then('the category should be renamed successfully', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(200, 'Category should be renamed successfully');
});

Then('the category name should be {string}', async function (this: CategoryWorld, expectedName: string) {
  const db = getDb();
  const apiClient = getApiClient();

  // Get the category ID from the response or stored data
  const categoryId = this.response?.data?.id || Array.from(this.categoriesByName.values())[0].id;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  expect(result).to.have.lengthOf(1, 'Category should exist in database');
  expect(result[0].name).to.equal(expectedName, 'Category name should be updated');
});


// Rename exercise steps
When('the user renames the exercise {string} to {string}', async function (this: CategoryWorld, oldName: string, newName: string) {
  const apiClient = getApiClient();
  const db = getDb();

  const result = await db
    .select()
    .from(exercises)
    .where(eq(exercises.name, oldName))
    .limit(1);

  expect(result).to.have.lengthOf(1, `Exercise "${oldName}" should exist`);
  const exerciseId = result[0].id;

  this.response = await apiClient.patch(`/exercises/${exerciseId}`, {
    name: newName,
  });
});

Then('the exercise should be renamed successfully', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(200, 'Exercise should be renamed successfully');
});

Then('the exercise name should be {string}', async function (this: CategoryWorld, expectedName: string) {
  const db = getDb();

  const exerciseId = this.response?.data?.id;
  expect(exerciseId).to.exist;

  const result = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, exerciseId))
    .limit(1);

  expect(result).to.have.lengthOf(1, 'Exercise should exist in database');
  expect(result[0].name).to.equal(expectedName, 'Exercise name should be updated');
});


// Delete category steps
When('the user attempts to delete the category {string}', async function (this: CategoryWorld, categoryName: string) {
  const apiClient = getApiClient();

  expect(this.categoriesByName.has(categoryName)).to.be.true;
  const category = this.categoriesByName.get(categoryName);

  this.response = await apiClient.delete(`/categories/${category!.id}`);
});

Then('the category should be deleted successfully', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(204, 'Category should be deleted successfully');
});

Then('the category should no longer exist in the system', async function (this: CategoryWorld) {
  const db = getDb();

  const categoryId = Array.from(this.categoriesByName.values())[0].id;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  expect(result).to.have.lengthOf(0, 'Category should be deleted from database');
});

Then('the deletion should fail with a message indicating exercises must be deleted first', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(400, 'Deletion should fail with bad request');
  expect(this.response!.data).to.have.property('message');
  expect(this.response!.data.message).to.include('exercises');
});

Then('the category should still exist in the system', async function (this: CategoryWorld) {
  const db = getDb();

  const categoryId = Array.from(this.categoriesByName.values())[0].id;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  expect(result).to.have.lengthOf(1, 'Category should still exist in database');
});


// Uniqueness validation steps
When('the user attempts to create another category with name {string}', async function (this: CategoryWorld, categoryName: string) {
  const apiClient = getApiClient();

  this.response = await apiClient.post('/categories', {
    name: categoryName,
    description: 'Duplicate category description',
  });
});

Then('the category creation should fail with a conflict error', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(409, 'Category creation should fail with conflict status');
});

Then('the error message should indicate that the category name already exists', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.data).to.have.property('message');
  expect(this.response!.data.message).to.include('already exists');
});

When('the user attempts to create another exercise with name {string}', async function (this: CategoryWorld, exerciseName: string) {
  const apiClient = getApiClient();

  const primaryCategory = Array.from(this.categoriesByName.values())[0];

  this.response = await apiClient.post('/exercises', {
    name: exerciseName,
    description: 'Duplicate exercise description',
    equipmentType: 'Dumbbell',
    targets: [
      {
        categoryId: primaryCategory.id,
        type: 'Primary',
      },
    ],
  });
});

Then('the exercise creation should fail with a conflict error', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.status).to.equal(409, 'Exercise creation should fail with conflict status');
});

Then('the error message should indicate that the exercise name already exists', function (this: CategoryWorld) {
  expect(this.response).to.exist;
  expect(this.response!.data).to.have.property('message');
  expect(this.response!.data.message).to.include('already exists');
});
