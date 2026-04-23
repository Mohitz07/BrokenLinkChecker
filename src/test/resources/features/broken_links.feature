Feature: Validate broken links on Demoqa homepage

  Scenario: Verify no broken links exist on homepage
    Given user launches the ycce broken links page
    When user extracts all hyperlinks
    And user validates all links
    Then export results and validate