@api @backend
Feature: List users with pagination

  As a company admin using the API
  I want the user list returned in pages
  So that large companies load quickly and predictably

  Background:
    Given the company "Acme" has 45 users
    And the caller is authenticated as an admin of "Acme"

  Scenario: First page uses the default page size
    When the caller lists users without paging options
    Then 20 users are returned
    And the response says there is a next page

  Scenario: Last page is partial and has no next page
    When the caller requests page 3 with a page size of 20
    Then 5 users are returned
    And the response says there is no next page

  Scenario Outline: Page size is limited to a sensible range
    When the caller requests a page size of <requested>
    Then the request is <result>

    Examples:
      | requested | result                                            |
      | 1         | accepted with 1 user                              |
      | 100       | accepted with 45 users                            |
      | 0         | rejected with "page size must be between 1 and 100" |
      | 101       | rejected with "page size must be between 1 and 100" |

  @security @authorization
  Scenario: Pagination never exposes another company's users
    Given the company "Brightline" has 30 users
    When the caller lists every page of users
    Then only users of "Acme" are returned
    And the total count is 45

  @authentication
  Scenario: Unauthenticated caller is refused
    Given the caller is not authenticated
    When the caller lists users
    Then the request is refused as unauthenticated
    And no user data is returned
