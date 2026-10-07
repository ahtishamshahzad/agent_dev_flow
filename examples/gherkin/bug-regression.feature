@regression @bugfix @payment @bug-014
Feature: Prevent duplicate order submission

  As a customer
  I want one order for one checkout
  So that I am never charged twice

  Customers were charged twice when the payment page was slow.
  These scenarios failed before the fix and stay as permanent regression coverage.

  @critical
  Scenario: Customer submits the same checkout twice in quick succession
    Given Priya has a basket totalling "£48.00"
    And Priya has completed the checkout form
    When Priya submits the checkout twice within one second
    Then exactly one order is created
    And Priya's card is charged "£48.00" once

  Scenario: Customer retries after a timeout that actually succeeded
    Given Priya submitted the checkout and the payment was taken
    But Priya's screen showed a timeout
    When Priya submits the same checkout again
    Then no second order is created
    And Priya sees her existing order confirmation
