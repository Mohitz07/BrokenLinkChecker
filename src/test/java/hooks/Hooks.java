package hooks;

import io.cucumber.java.*;
import io.qameta.allure.Attachment;
import org.openqa.selenium.*;

import utils.DriverManager;

public class Hooks {

    @Before
    public void setUp() {
        // Browser is already set via System property from TestNG XML
        DriverManager.getDriver();
    }

    @After
    public void tearDown(Scenario scenario) {

        if (scenario.isFailed()) {
            takeScreenshot();
        }

        DriverManager.quitDriver();
    }

    @Attachment(value = "Failure Screenshot", type = "image/png")
    public byte[] takeScreenshot() {
        return ((TakesScreenshot) DriverManager.getDriver())
                .getScreenshotAs(OutputType.BYTES);
    }
}