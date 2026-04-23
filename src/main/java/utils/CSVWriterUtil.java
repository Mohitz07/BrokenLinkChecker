package utils;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class CSVWriterUtil {

    public static void writeLinksToCSV(List<String> links, String filePath) {

        try (FileWriter writer = new FileWriter(filePath)) {

            // ✅ Header must match JMeter variable
            writer.append("path\n");

            for (String link : links) {

                String cleanLink = link
                        .split(" \\[")[0]
                        .trim();

                // ✅ Remove domain if present
                cleanLink = cleanLink
                        .replace("https://ycce.edu", "")
                        .replace("http://ycce.edu", "");

                // ✅ Ensure it starts with /
                if (!cleanLink.startsWith("/")) {
                    cleanLink = "/" + cleanLink;
                }

                writer.append(cleanLink).append("\n");
            }

            System.out.println("CSV Generated Successfully at: " + filePath);

        } catch (IOException e) {
            throw new RuntimeException("Error writing CSV: " + e.getMessage());
        }
    }
}