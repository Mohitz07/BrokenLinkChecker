package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.edge.EdgeDriver;

import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.net.URL;
import java.time.Duration;

public class DriverManager {

    private static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    private DriverManager() {}

    public static WebDriver getDriver() {

        if (driver.get() == null) {

            //  Browser from TestNG XML OR CLI
            String browser = System.getProperty("browser");

            if (browser == null || browser.isEmpty()) {
                browser = ConfigReader.get("browser"); // fallback
            }

            String grid = System.getProperty("grid", "false");

            try {

                // =========================
                // GRID EXECUTION
                // =========================
                if (grid.equalsIgnoreCase("true")) {

                    DesiredCapabilities capabilities = new DesiredCapabilities();
                    capabilities.setBrowserName(browser.toLowerCase());

                    driver.set(new RemoteWebDriver(
                            new URL("http://172.21.0.88:4444"),
                            capabilities
                    ));

                } else {

                    // =========================
                    // LOCAL EXECUTION
                    // =========================
                    switch (browser.toLowerCase()) {

                        case "chrome":
                            WebDriverManager.chromedriver().setup();
                            driver.set(new ChromeDriver());
                            break;

                        default:
                            throw new RuntimeException("Invalid browser: " + browser);
                    }
                }

                // =========================
                // COMMON CONFIG
                // =========================
                driver.get().manage().window().maximize();

                driver.get().manage().timeouts()
                        .implicitlyWait(Duration.ofSeconds(
                                Integer.parseInt(ConfigReader.get("implicit.wait"))
                        ));

            } catch (Exception e) {
                throw new RuntimeException("Driver initialization failed for browser: " + browser, e);
            }
        }

        return driver.get();
    }

    public static void quitDriver() {

        if (driver.get() != null) {
            driver.get().quit();
            driver.remove(); // VERY IMPORTANT for parallel execution
        }
    }
}