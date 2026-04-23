# Broken Link Checker — End-to-End Test Automation Framework

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Report Generation](#report-generation)
- [Framework Architecture](#framework-architecture)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

JMeter report generation command :  jmeter -g (jmeter-results-path) -o (path where you want to save the report)

## 🎯 Overview

**Broken Link Checker** is a comprehensive end-to-end test automation framework built in Java that validates the integrity of web applications across three critical dimensions:

## WHAT THIS PROJECT DOES
This project is a full end-to-end automated quality pipeline built in Java
that does three things:

1. FUNCTIONAL: Uses Selenium WebDriver to open demoqa(https://demoqa.com/broken),
   extract all hyperlinks from the homepage, filter out invalid URLs
   (empty, javascript:void, mailto:, #), then uses RestAssured to send HTTP
   HEAD requests (with GET fallback) to each link and check if the status
   code is >= 400 (broken).

2. REPORTING: All broken links are flagged as failed test steps in a rich
   Allure HTML Report with screenshots attached on failure. Valid and broken
   links are saved to separate CSV files (valid_links.csv, broken_links.csv).

3. PERFORMANCE: A JMeterUtil class auto-triggers Apache JMeter after link
   validation completes. It reads valid_links.csv and fires 10 concurrent
   threads at each valid link to check if they hold up under load. Results
   are saved as a JMeter HTML Dashboard Report.

### 1. **Functional Testing** — Link Validation
The framework uses **Selenium WebDriver 4.21.0** to navigate to [DemoQA Broken Links Page](https://demoqa.com/broken), automatically extracts all hyperlinks from the homepage, and systematically validates each link's availability.

**Validation Process:**
- Opens the target URL in Chrome browser
- Extracts all `<a>` tag `href` attributes
- Filters out invalid URLs (empty strings, javascript:void, mailto:, anchor links `#`)
- Uses **RestAssured 5.4.0** to send HTTP HEAD requests to each valid link
- Falls back to GET requests if HEAD is blocked or returns error status
- Applies configurable timeout (5000ms default) to prevent hanging requests
- Marks links with HTTP status code ≥ 400 as **broken**
- Marks links with HTTP status code < 400 as **valid**

### 2. **Test Reporting** — Rich Allure Reports
All test results, including screenshots and detailed logs, are captured in an **Allure Report**.

**Report Features:**
- Real-time test step execution with Allure annotations (`@Step`)
- Automatic screenshot attachment on test failure
- Browser-based HTML dashboard with test history
- Detailed breakdown of valid and broken links
- Integration with CI/CD pipelines for artifact archival

### 3. **Performance Testing** — Load Testing with Apache JMeter
After functional validation completes, the framework **automatically triggers Apache JMeter** to stress-test valid links discovered during the initial scan.

**Load Testing Details:**
- JMeter reads the generated `valid_links_jmeter.csv` file
- Executes 10 concurrent threads against each valid link
- Measures response time, throughput, and error rate under concurrent load
- Generates an **interactive JMeter HTML Dashboard Report**
- Identifies performance bottlenecks and degradation patterns

---

## 📁 Project Structure

```
BrokenLinkChecker/
├── src/
│   ├── main/java/utils/
│   │   ├── ConfigReader.java           # Reads config.properties file
│   │   ├── DriverManager.java          # Manages WebDriver lifecycle (ThreadLocal)
│   │   ├── LinkValidator.java          # HTTP validation logic (HEAD → GET fallback)
│   │   ├── JMeterRunner.java           # Triggers JMeter programmatically
│   │   └── CSVWriterUtil.java          # Exports links to CSV for JMeter consumption
│   ├── test/
│   │   ├── java/
│   │   │   ├── runner/
│   │   │   │   └── TestRunner.java     # Cucumber + TestNG entry point
│   │   │   ├── steps/
│   │   │   │   └── BrokenLinkSteps.java # BDD step definitions (Given/When/Then)
│   │   │   └── hooks/
│   │   │       └── Hooks.java          # Setup/teardown, screenshot capture
│   │   └── resources/
│   │       ├── config.properties       # Configuration file (browsers, URLs, timeouts)
│   │       ├── allure.properties       # Allure report configuration
│   │       ├── features/
│   │       │   └── broken_links.feature # Gherkin feature file
│   │       ├── jmeter/
│   │       │   └── LoadTest.jmx        # JMeter test plan definition
│   │       └── testdata/
│   │           └── valid_links_jmeter.csv # Generated at runtime
├── target/
│   ├── allure-results/                 # Allure report JSON artifacts
│   ├── jmeter-results.jtl              # JMeter execution results
│   └── classes/                        # Compiled bytecode
├── pom.xml                             # Maven dependency management
├── testng.xml                          # TestNG parallel execution config
└── README.md                           # This file
```

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Java | 21 | Core programming language |
| **Build Tool** | Maven | 3.9+ | Dependency & build management |
| **Web Automation** | Selenium WebDriver | 4.21.0 | Browser automation |
| **Driver Management** | WebDriverManager | 5.8.0 | Automatic driver binary provisioning |
| **API Testing** | RestAssured | 5.4.0 | HTTP request/response validation |
| **BDD Framework** | Cucumber | 7.15.0 | Gherkin feature files & step definitions |
| **Test Framework** | TestNG | 7.10.2 | Test execution & parallel management |
| **Reporting** | Allure | 2.24.0 | Rich HTML test reports |
| **Load Testing** | Apache JMeter | 5.5+ | Performance/concurrency testing |
| **Plugin** | JMeter Maven Plugin | 3.7.0 | JMeter integration with Maven |

---

## ✅ Prerequisites

Before running this project, ensure you have:

### 1. **Java Development Kit (JDK)**
```bash
java -version
# Expected: Java 21 or higher
# Download from: https://adoptopenjdk.net/ or https://www.oracle.com/java/technologies/downloads/
```

### 2. **Maven**
```bash
mvn -v
# Expected: Apache Maven 3.9.x or higher
# Download from: https://maven.apache.org/download.cgi
```

### 3. **Git** (for version control)
```bash
git --version
# Download from: https://git-scm.com/
```

### 4. **Chrome Browser**
- The framework is configured to run on Chrome by default
- Download: [Google Chrome](https://www.google.com/chrome/)
- Chrome binary must be installed on the system (WebDriverManager auto-detects it)

### 5. **Apache JMeter** (for performance testing)
- Download: [Apache JMeter 5.5+](https://jmeter.apache.org/download_jmeter.cgi)
- Extract to a known location (e.g., `C:\JMeter\apache-jmeter-5.6.3\`)
- Update `JMeterRunner.java` line 12 with your JMeter installation path

### 6. **Allure Command Line Tool** (optional, for report generation)
```bash
# Install via npm
npm install -g allure-commandline

# Or via Homebrew (macOS)
brew install allure

# Or via Chocolatey (Windows)
choco install allure
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd BrokenLinkChecker
```

### Step 2: Install Maven Dependencies
```bash
mvn clean install
```
This command:
- Downloads all required JAR files from Maven Central Repository
- Compiles source code
- Runs pre-test validations

### Step 3: Configure JMeter Path (Important!)
Edit `src/main/java/utils/JMeterRunner.java` line 12:

**Windows Example:**
```java
String jmeterPath = "C:\\JMeter\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
```

**Linux/macOS Example:**
```java
String jmeterPath = "/opt/jmeter/bin/jmeter";
```

### Step 4: Verify Installation
```bash
mvn test -DskipTests
```
This ensures all dependencies are properly installed without running tests.

---

## ⚙️ Configuration

### Main Configuration File: `config.properties`
Located at: `src/test/resources/config.properties`

```properties
# Browser selection (currently supports: chrome)
browsers=chrome

# Target URL for broken link validation
base.url=https://demoqa.com/broken

# Implicit wait for Selenium WebDriver (in seconds)
implicit.wait=10

# Timeout for HTTP requests (in milliseconds)
link.timeout=5000
```

**Configuration Details:**

| Property | Value | Description |
|----------|-------|-------------|
| `browsers` | `chrome` | Browser to launch. WebDriverManager auto-downloads compatible ChromeDriver |
| `base.url` | `https://demoqa.com/broken` | Target URL containing links to validate |
| `implicit.wait` | `10` | Maximum time Selenium waits for elements to be present (seconds) |
| `link.timeout` | `5000` | Timeout for HTTP HEAD/GET requests in LinkValidator (milliseconds) |

### TestNG Configuration: `testng.xml`
Defines parallel execution strategy:

```xml
<suite name="MultiBrowser Suite" parallel="tests" thread-count="2">
    <test name="Chrome Test">
        <parameter name="browser" value="chrome"/>
```

- **Parallel Mode:** Tests can run sequentially or in parallel (adjust `thread-count`)
- **Browser Parameter:** Passed from TestNG to DriverManager

### Allure Configuration: `allure.properties`
```properties
allure.results.directory=target/allure-results
```
Specifies where Allure stores test result artifacts.

---

## ▶️ Running Tests

### Option 1: Run All Tests (Functional + Performance)
```bash
mvn clean test
```
**What happens:**
1. Cleans previous build artifacts
2. Compiles source code
3. Launches Chrome browser
4. Extracts links from DemoQA page
5. Validates each link via HTTP HEAD/GET
6. Exports valid links to CSV
7. Automatically triggers JMeter load testing
8. Generates Allure and JMeter reports

**Execution Time:** ~5-10 minutes (depending on JMeter load test duration)

### Option 2: Run Functional Tests Only (Skip JMeter)
Modify `BrokenLinkSteps.java` line 76:
```java
// Comment out this line temporarily:
// JMeterRunner.runJMeterTest();
```

Then run:
```bash
mvn clean test
```

**Execution Time:** ~2-3 minutes

### Option 3: Run with Specific Browser (if more browsers added)
```bash
mvn clean test -Dbrowser=chrome
```

### Option 4: Run with Maven Surefire Plugin
```bash
mvn clean verify
```
Explicitly invokes Surefire plugin for test execution.

### Option 5: Debug Mode (with logs)
```bash
mvn clean test -X
```
Shows verbose Maven debug logs.

---

## 📊 Report Generation

### Allure Report (Functional Test Results)

**Generate HTML Report:**
```bash
allure generate target/allure-results --clean -o target/allure-report
```

**Open in Browser:**
```bash
# Windows
start target/allure-report/index.html

# macOS
open target/allure-report/index.html

# Linux
xdg-open target/allure-report/index.html
```

**Report Features:**
- ✅ Test execution timeline
- 🖼️ Screenshots on failure
- 📈 Trend analysis
- 🔍 Detailed step logs
- 🏷️ Test categorization

### JMeter HTML Dashboard Report

After test execution, find the report at:
```
target/jmeter-results.jtl  (raw data)
```

To generate interactive dashboard:
```bash
jmeter -g target/jmeter-results.jtl -o target/jmeter-dashboard
```

**Report Location:** Open `target/jmeter-dashboard/index.html` in browser

**Metrics Displayed:**
- Response time distribution
- Throughput (requests/second)
- Error rate under load
- Latency percentiles (50th, 90th, 95th, 99th)
- Active threads over time

### CSV Export Files

**Valid Links:** `src/test/resources/testdata/valid_links_jmeter.csv`
```csv
targetURL
demoqa.com/elements
demoqa.com/forms
demoqa.com/widgets
```

**Purpose:** JMeter reads this file to parameterize load test requests.

---

## 🏗️ Framework Architecture

### 1. **WebDriver Management** (DriverManager.java)
```
ThreadLocal<WebDriver>
├── Browser Selection (Chrome/Firefox/Edge)
├── Automatic Driver Download (WebDriverManager)
├── Window Maximization
├── Implicit Wait Configuration
└── Thread-Safe Lifecycle (getDriver/quitDriver)
```

**Why ThreadLocal?** Ensures thread-safe WebDriver instances in parallel test execution.

### 2. **BDD Test Structure** (Cucumber + TestNG)
```
Feature File (Gherkin)
    ↓
Scenario Outline / Scenario
    ↓
Step Definitions (BrokenLinkSteps.java)
    ├── @Given: Launch Browser
    ├── @When: Extract Links
    ├── @And: Validate Links
    └── @Then: Assert & Export Results
    ↓
Test Hooks (Hooks.java)
    ├── @Before: Setup Driver
    └── @After: Screenshot on Failure, Quit Driver
```

### 3. **Link Validation Pipeline** (LinkValidator.java)
```
URL → HEAD Request
    ↓
Success (< 400)?
    ├─ YES → Mark as VALID
    └─ NO → HEAD Fallback to GET Request
            ↓
        GET Response Status?
            ├─ < 400 → VALID
            └─ ≥ 400 → BROKEN
```

**Timeout Handling:** Custom HttpClient timeout prevents hanging on unresponsive servers.

### 4. **Data Export** (CSVWriterUtil.java)
```
Extracted Links
    ↓
Filter Valid Links
    ↓
Clean URLs (remove protocol)
    ↓
Write to CSV with Header "targetURL"
    ↓
valid_links_jmeter.csv
    ↓
JMeter Reads & Parameterizes Load Test
```

### 5. **Load Testing Integration** (JMeterRunner.java)
```
ProcessBuilder
    ↓
Execute: jmeter.bat -n -t LoadTest.jmx -l jmeter-results.jtl
    ↓
Non-GUI Mode (-n)
    ├─ No UI overhead
    ├─ Faster execution
    └─ Server-friendly
    ↓
JMeter Execution Log → System.out ([JMETER] prefix)
    ↓
Exit Code Verification
```

---

## 🚀 Advanced Features

### 1. **Parallel Test Execution**
Modify `testng.xml`:
```xml
<suite name="MultiBrowser Suite" parallel="tests" thread-count="4">
```
This runs multiple browsers/threads concurrently.

### 2. **Custom Timeouts**
Edit `config.properties`:
```properties
link.timeout=10000  # Increase for slow servers
implicit.wait=15    # Increase for slow page loads
```

### 3. **Adding More Browsers**
Update `DriverManager.java`:
```java
case "firefox":
    WebDriverManager.firefoxdriver().setup();
    driver.set(new FirefoxDriver());
    break;
```

Then update `testng.xml`:
```xml
<test name="Firefox Test">
    <parameter name="browser" value="firefox"/>
```

### 4. **Grid Execution** (Selenium Grid)
DriverManager supports remote grid execution:
```bash
mvn test -Dbrowser=chrome -Dgrid=true
```
Requires Selenium Grid Hub running at `http://192.168.100.5:4444` (configurable in DriverManager.java line 46).

### 5. **Continuous Integration (CI)**
Add to your Jenkins/GitHub Actions pipeline:
```bash
#!/bin/bash
mvn clean test
allure generate target/allure-results --clean -o target/allure-report
# Archive allure-report and jmeter-results
```

### 6. **Custom Link Filtering**
Modify filtering logic in `BrokenLinkSteps.java` line 30-35:
```java
.filter(link -> !link.isEmpty() && link.startsWith("http"))
// Add custom filters:
.filter(link -> !link.contains("redirect"))  // Skip redirects
.filter(link -> !link.contains("deprecated")) // Skip deprecated
```

---

## 🐛 Troubleshooting

### Issue 1: ChromeDriver Not Found
**Error:** `SessionNotCreatedException: unknown error: Chrome failed to start`

**Solution:**
```bash
# Verify Chrome is installed
chrome --version  # Windows: chrome.exe --version

# If not installed, download from:
# https://www.google.com/chrome/

# Force WebDriverManager to download driver
mvn clean install -U
```

### Issue 2: JMeter Execution Fails
**Error:** `Error running JMeter: Cannot run program "jmeter.bat"`

**Solution:**
1. Verify JMeter installation:
   ```bash
   C:\JMeter\apache-jmeter-5.6.3\bin\jmeter.bat --version
   ```

2. Update path in `JMeterRunner.java`:
   ```java
   // Get correct path
   String jmeterPath = "C:\\JMeter\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
   // Or on Linux/macOS:
   String jmeterPath = "/opt/jmeter/bin/jmeter";
   ```

3. Ensure no spaces in path, or escape properly:
   ```java
   String jmeterPath = "C:\\Program Files\\JMeter\\bin\\jmeter.bat";
   ```

### Issue 3: Test Hangs on Link Validation
**Error:** Timeout waiting for HTTP response

**Solution:**
Increase timeout in `config.properties`:
```properties
link.timeout=15000  # 15 seconds instead of 5
```

Or add to RestAssured in `LinkValidator.java`:
```java
.config(RestAssured.config()
    .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
        .setParam("http.connection.timeout", timeout)
        .setParam("http.socket.timeout", timeout)
        .setParam("http.connection.manager.timeout", timeout)))
```

### Issue 4: Allure Report Not Generated
**Error:** `target/allure-results/` is empty

**Solution:**
```bash
# Verify Allure is installed
allure --version

# Check if Allure listeners are in pom.xml (they are by default)
# If reports directory is empty, tests may have skipped
mvn clean test -DskipTests=false
```

### Issue 5: Configuration File Not Found
**Error:** `Failed to load config file`

**Solution:**
```bash
# Verify file exists
ls -la src/test/resources/config.properties

# Ensure running from project root
pwd  # Should end in BrokenLinkChecker/

# If running from IDE, mark as test resource:
# Right-click src/test/resources → Mark Directory As → Test Resources
```

### Issue 6: CSV File Not Generated
**Error:** `valid_links_jmeter.csv` not created

**Solution:**
1. Check test execution output:
   ```bash
   mvn test 2>&1 | grep "CSV Generated"
   ```

2. Verify step execution reached `exportAndAssert()`:
   ```bash
   # Check Allure report for failed steps
   allure generate target/allure-results --clean -o target/allure-report
   ```

3. Manually create file structure:
   ```bash
   mkdir -p src/test/resources/testdata
   ```

### Issue 7: Port Already in Use (JMeter)
**Error:** JMeter samples port conflicts

**Solution:**
- JMeter picks random ports automatically; this is usually not an issue
- If specific port required, edit `LoadTest.jmx` configuration

---

## 📝 Contributing

### Code Standards
- **Language:** Java 21
- **Style:** Google Java Style Guide
- **Naming:** 
  - Classes: `PascalCase` (e.g., `LinkValidator`)
  - Methods: `camelCase` (e.g., `getStatusCode`)
  - Constants: `UPPER_CASE` (e.g., `DEFAULT_TIMEOUT`)

### Adding New Features
1. Create feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Follow BDD structure:
   - Add scenario to `broken_links.feature`
   - Implement steps in `BrokenLinkSteps.java`
   - Add utility methods if needed

3. Test thoroughly:
   ```bash
   mvn clean test
   ```

4. Generate reports:
   ```bash
   allure generate target/allure-results --clean -o target/allure-report
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "feat: Add new link validation logic"
   git push origin feature/my-feature
   ```

### Reporting Bugs
Include in bug report:
- Java version: `java -version`
- Maven version: `mvn -v`
- OS (Windows/Linux/macOS)
- Full error message and stack trace
- Steps to reproduce
- Expected vs. actual behavior

---

## 📞 Support & Documentation

- **Selenium WebDriver:** https://www.selenium.dev/documentation/
- **Cucumber BDD:** https://cucumber.io/docs/cucumber/
- **TestNG:** https://testng.org/doc/
- **RestAssured:** https://rest-assured.io/
- **Allure:** https://docs.qameta.io/allure/
- **Apache JMeter:** https://jmeter.apache.org/usermanual/
- **WebDriverManager:** https://bonigarcia.dev/webdrivermanager/

---

## 📄 License

This project is provided as-is for training and demonstration purposes.

---

## ✨ Summary of What This Framework Does

| Phase | Tool | Action | Output |
|-------|------|--------|--------|
| **Functional** | Selenium + RestAssured | Extract & validate links | ✅/❌ per link |
| **Reporting** | Allure + Screenshots | Capture execution details | HTML Report + Screenshots |
| **Performance** | JMeter | Load test valid links | Response times, Throughput, Error rates |
| **Data Export** | CSVWriterUtil | Export valid links | valid_links_jmeter.csv |
| **Integration** | Maven + Hooks | Automated pipeline | One command runs all 3 phases |

---

**Built with ❤️ for Quality Assurance**

Last Updated: April 2026  
Framework Version: 1.0-SNAPSHOT

