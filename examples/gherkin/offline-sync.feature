@mobile @offline
Feature: Complete an inspection without network

  As an inspector working in basements and remote sites
  I want to finish inspections with no signal
  So that no work is lost and nothing is entered twice

  Background:
    Given Ana has the job "Boiler check, Unit 4" downloaded on her phone

  Scenario: Inspector completes an inspection while offline
    Given Ana's phone has no network connection
    When Ana completes the checklist and adds 3 photos
    Then the inspection is saved on the phone
    And the inspection shows as "Waiting to sync"

  Scenario: Offline work syncs once the connection returns
    Given Ana completed the inspection while offline
    When Ana's phone reconnects
    Then the inspection and its 3 photos appear on the manager's dashboard
    And the inspection on Ana's phone shows as "Synced"

  @critical @regression
  Scenario: Sync interrupted midway does not create a duplicate
    Given Ana completed the inspection while offline
    And the connection dropped while the inspection was syncing
    When Ana's phone reconnects and syncs again
    Then the dashboard shows exactly one inspection for "Boiler check, Unit 4"
    And it has exactly 3 photos

  Scenario: Work survives the app being closed before sync
    Given Ana completed the inspection while offline
    When Ana closes the app and opens it again
    Then the inspection is still shown as "Waiting to sync"
