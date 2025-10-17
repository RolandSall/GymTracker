Feature: Category Creation
  As a user
  I want to create a category
  So that the category is available for organizing my exercises

  Scenario: Successfully create a new category
    Given the user wants to create a muscle group category for "Chest"
    When the category is created through the system
    Then the "Chest" category should be available for organizing exercises
