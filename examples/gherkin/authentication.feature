@authentication @security
Feature: Reset a forgotten password

  As a registered user
  I want to reset my password from an emailed link
  So that I can get back into my account without support

  Scenario: User resets the password with a valid link
    Given Lena requested a password reset 10 minutes ago
    When Lena opens the reset link and sets the password "correct horse battery staple"
    Then Lena can sign in with "correct horse battery staple"
    And Lena can no longer sign in with her old password

  Scenario: Expired reset link is refused
    Given Lena requested a password reset 2 hours ago
    When Lena opens the reset link
    Then Lena sees "This link has expired"
    And Lena is offered a new reset email

  Scenario: Reset link works only once
    Given Lena already used her reset link
    When the same link is opened again
    Then the password is not changed
    And the page says "This link has already been used"

  Scenario: Requesting a reset does not reveal whether an account exists
    When someone requests a reset for "nobody@example.com"
    Then they see "If an account exists, we have sent a reset link"
    And the response takes as long as it does for a real account

  Scenario: Other sessions are signed out after a reset
    Given Lena is signed in on her laptop
    When Lena resets her password from her phone
    Then her laptop session is signed out
