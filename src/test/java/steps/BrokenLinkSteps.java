package steps;

import utils.JMeterRunner;
import io.cucumber.java.en.*;
import io.qameta.allure.Step;
import org.openqa.selenium.*;
import utils.*;
import java.util.*;
import java.util.stream.Collectors;
import org.testng.Assert;

public class BrokenLinkSteps {

    WebDriver driver;
    List<String> allLinks;
    List<String> brokenLinks = new ArrayList<>(); // No need for synchronizedList in sequential mode
    List<String> validLinks = new ArrayList<>();

    @Given("user launches the ycce broken links page")
    public void launchDemoQAPage() {
        driver = DriverManager.getDriver();
        driver.get(ConfigReader.get("base.url"));
    }

    @When("user extracts all hyperlinks")
    public void extractLinks() {

        List<WebElement> elements = driver.findElements(By.tagName("a"));

        allLinks = elements.stream()
                .map(e -> e.getAttribute("href"))

                //  Handle null first (VERY IMPORTANT)
                .filter(Objects::nonNull)

                //  Ensure proper format
                .map(link -> link.trim())

                //  Only HTTP/HTTPS links
                .filter(link -> link.startsWith("http"))

                //  Only your domain
                .filter(link -> link.contains("ycce.edu"))

                //  Remove useless/invalid links
                .filter(link -> !link.contains("#"))
                .filter(link -> !link.contains("mailto:"))
                .filter(link -> !link.contains("tel:"))
                .filter(link -> !link.endsWith(".pdf"))
                .filter(link -> !link.endsWith(".doc"))
                .filter(link -> !link.contains("https://") || link.startsWith("https://"))
                .filter(link -> !link.contains("https://ycce.edu/https"))

                //  Remove trailing slash duplicates
                .map(link -> link.endsWith("/") ? link.substring(0, link.length() - 1) : link)

                .distinct()

                //  LIMIT (prevents long execution)
                .limit(100)

                .collect(Collectors.toList());

        System.out.println("Total links collected (limited): " + allLinks.size());

        //  Debug print (important for JMeter validation)
        allLinks.forEach(link -> System.out.println("Collected: " + link));
    }

    @And("user validates all links")
    @Step("Sequential validation of ycce links")
    public void validateLinksSequential() {
        // In sequential mode, we process the list one by one
        for (String link : allLinks) {
            try {
                int statusCode = LinkValidator.getStatusCode(link);

                if (statusCode >= 400) {
                    brokenLinks.add(link + " [Status: " + statusCode + "]");
                } else {
                    validLinks.add(link + " [Status: " + statusCode + "]");
                }
            } catch (Exception e) {
                brokenLinks.add(link + " [Exception: " + e.getMessage() + "]");
            }
        }
    }

    @Then("export results and validate")
    public void exportAndAssert() {

        System.out.println("--- Valid Links Found ---");
        validLinks.forEach(System.out::println);

        System.out.println("\n--- Broken Links Found ---");
        brokenLinks.forEach(System.out::println);

        List<String> cleanValidLinks = validLinks.stream()
                .map(link -> link.split(" \\[")[0])
                .filter(link -> link.startsWith("http"))
                .limit(50)
                .collect(Collectors.toList());

        List<String> cleanBrokenLinks = brokenLinks.stream()
                .map(link -> link.split(" \\[")[0].trim())
                .filter(link -> link.startsWith("http"))
                .collect(Collectors.toList());

        CSVWriterUtil.writeLinksToCSV(
                cleanValidLinks,
                "src/test/resources/testdata/valid_links_jmeter.csv"
        );

        CSVWriterUtil.writeLinksToCSV(
                cleanBrokenLinks,
                "src/test/resources/testdata/broken_links.csv"
        );

        //  Debug CSV content before JMeter
        System.out.println("\n--- CSV Data for JMeter ---");
        cleanValidLinks.forEach(System.out::println);

        //Commenting this out to run jmeter using jenkins and not locally
        //JMeterRunner.runJMeterTest();

        Assert.assertFalse(brokenLinks.isEmpty(),
                "There are broken links on the page!");
    }
}