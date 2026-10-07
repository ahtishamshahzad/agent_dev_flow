@subscription @payment
Feature: Upgrade a subscription

  As a company admin
  I want to upgrade to the yearly plan
  So that we pay less and keep premium features

  Background:
    Given "Acme" is on the monthly plan with 5 seats
    And Sam is signed in as Acme's admin

  @critical
  Scenario: Admin upgrades to the yearly plan
    When Sam upgrades to the yearly plan and the payment succeeds
    Then Acme is on the yearly plan with 5 seats
    And Sam receives a receipt for the prorated amount

  Scenario: Declined payment leaves the plan unchanged
    When Sam upgrades to the yearly plan and the card is declined
    Then Acme is still on the monthly plan
    And Sam sees "Your card was declined — your plan has not changed"

  @critical @regression
  Scenario: A repeated upgrade confirmation is applied only once
    When the payment provider confirms the same upgrade twice
    Then Acme has exactly one yearly subscription
    And Acme is charged once

  @authorization
  Scenario: A manager cannot change the subscription
    Given Maya is signed in as a manager at Acme
    When Maya tries to upgrade to the yearly plan
    Then the upgrade is refused as not permitted
    And Acme is still on the monthly plan
