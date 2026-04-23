package utils;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class JMeterRunner {

    public static void runJMeterTest() {

        try {
            String jmeterPath = "C:\\JMeter\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
            String jmxFile = "src/test/resources/jmeter/LoadTest.jmx";

            //  Unique timestamp for every run
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

            String resultFile = "target/jmeter-results-" + timestamp + ".jtl";
            String reportDir = "target/jmeter-report-" + timestamp;

            //  Clean old default files (optional safety)
            File oldResult = new File("target/jmeter-results.jtl");
            if (oldResult.exists()) oldResult.delete();

            File oldReport = new File("target/jmeter-report");
            if (oldReport.exists()) deleteDirectory(oldReport);

            //  JMeter command with HTML report generation
            ProcessBuilder builder = new ProcessBuilder(
                    jmeterPath,
                    "-n",
                    "-t", jmxFile,
                    "-l", resultFile,
                    "-e",                 // generate report
                    "-o", reportDir       // output folder
            );

            builder.redirectErrorStream(true);
            Process process = builder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[JMETER] " + line);
            }

            int exitCode = process.waitFor();
            System.out.println("JMeter Execution Completed. Exit Code: " + exitCode);

            //  Print report location
            System.out.println(" Report generated at: " + reportDir + "\\index.html");

        } catch (Exception e) {
            throw new RuntimeException("Error running JMeter: " + e.getMessage());
        }
    }

    //  Utility to delete directory
    private static void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    file.delete();
                }
            }
        }
        dir.delete();
    }
}