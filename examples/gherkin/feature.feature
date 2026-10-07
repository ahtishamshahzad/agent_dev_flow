@feature @web
Feature: Assign an inspection job

  As a manager
  I want to assign an inspection job to an inspector in my company
  So that every site visit has one accountable person

  Background:
    Given "Acme Inspections" has the manager "Maya" and the inspector "Ana"
    And Maya is signed in

  @critical
  Scenario: Manager assigns an unassigned job
    Given the job "Roof survey, 12 Elm Street" is unassigned
    When Maya assigns the job to Ana
    Then the job shows Ana as its inspector
    And the job appears in Ana's list of today's jobs

  Scenario: Manager reassigns a job that has not started
    Given the job "Roof survey, 12 Elm Street" is assigned to Ana and not started
    And "Acme Inspections" has the inspector "Omar"
    When Maya reassigns the job to Omar
    Then the job shows Omar as its inspector
    And the job no longer appears in Ana's list

  Scenario: Manager cannot reassign a job that is already in progress
    Given the job "Roof survey, 12 Elm Street" is in progress by Ana
    When Maya tries to reassign the job to Omar
    Then the reassignment is refused with the message "This job is already in progress"
    And the job still shows Ana as its inspector

  Scenario: Job cannot be assigned to someone outside the company
    Given "Brightline" has the inspector "Ben"
    When Maya tries to assign the job "Roof survey, 12 Elm Street" to Ben
    Then the assignment is refused
    And Ben is not offered as an inspector in Maya's assignment list
