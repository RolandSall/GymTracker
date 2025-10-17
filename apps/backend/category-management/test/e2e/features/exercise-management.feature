Feature: Exercise Management
  As a user
  I want to manage exercises
  So that I can track my workouts effectively

  Scenario: Successfully create a new exercise under a specific category
    Given that a category with name "Chest" exists
    And a category with name "Triceps" exists
    And the user decided to create a "Bench Press" exercise using the following equipment type "Barbell"
    And this exercise is marked as "Primary" for "Chest"
    And this exercise is marked as "Secondary" for "Triceps"
    Then this exercise should be available for the user to use in their workout

  Scenario: Fetch all exercises linked to a specific category
    Given that a category with name "Legs" exists
    And a category with name "Glutes" exists
    And the user created a "Squat" exercise with equipment "Barbell" targeting "Legs" as primary and "Glutes" as secondary
    And the user created a "Leg Curl" exercise with equipment "Machine" targeting "Legs" as primary
    When the user fetches all exercises for the "Legs" category
    Then the user should see 2 exercises available
    And all exercises should have the correct details

  Scenario: Delete an exercise
    Given that a category with name "Back" exists
    And the user created a "Deadlift" exercise with equipment "Barbell" targeting "Back" as primary
    When the user decides to delete the "Deadlift" exercise
    Then the exercise should no longer be available in the system

  Scenario: Fetch all available categories
    Given that a category with name "Chest" exists
    And a category with name "Back" exists
    And a category with name "Legs" exists
    When the user fetches all available categories
    Then the user should see 3 categories
    And all categories should have the correct details

  Scenario: Rename a category
    Given that a category with name "Chest" exists
    When the user renames the category "Chest" to "Pectorals"
    Then the category should be renamed successfully
    And the category name should be "Pectorals"

  Scenario: Rename an exercise
    Given that a category with name "Chest" exists
    And the user created a "Bench Press" exercise with equipment "Barbell" targeting "Chest" as primary
    When the user renames the exercise "Bench Press" to "Barbell Bench Press"
    Then the exercise should be renamed successfully
    And the exercise name should be "Barbell Bench Press"

  Scenario: Delete a category with no exercises
    Given that a category with name "Shoulders" exists
    When the user attempts to delete the category "Shoulders"
    Then the category should be deleted successfully
    And the category should no longer exist in the system

  Scenario: Attempt to delete a category with linked exercises
    Given that a category with name "Chest" exists
    And the user created a "Bench Press" exercise with equipment "Barbell" targeting "Chest" as primary
    When the user attempts to delete the category "Chest"
    Then the deletion should fail with a message indicating exercises must be deleted first
    And the category should still exist in the system

  Scenario: Attempt to create a category with duplicate name
    Given that a category with name "Chest" exists
    When the user attempts to create another category with name "Chest"
    Then the category creation should fail with a conflict error
    And the error message should indicate that the category name already exists

  Scenario: Attempt to create an exercise with duplicate name
    Given that a category with name "Chest" exists
    And the user created a "Bench Press" exercise with equipment "Barbell" targeting "Chest" as primary
    When the user attempts to create another exercise with name "Bench Press"
    Then the exercise creation should fail with a conflict error
    And the error message should indicate that the exercise name already exists
