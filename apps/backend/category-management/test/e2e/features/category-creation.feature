Feature: Category Creation
  As a user
  I want to create a category
  So that the category is available for me to use

  Scenario: Successfully create a new category
    Given I have category data with name "Chest" and description "Muscle Group"
    When I create the category via the API
    And the category should be stored in the database
    And the stored category should have the correct name and description
