package map;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class CSVReader {

    public static void main(String[] args) {

        String csvFile = "C:/NTNU/uttak_konvertert.csv";
        String line = "";
        String cvsSplitBy = ";";

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {

            while ((line = br.readLine()) != null) {

                // use ; as separator
                String[] cordinates = line.split(cvsSplitBy);

                System.out.println("Sted: "+cordinates[1]+", Kordinater: [UTMEast: " + cordinates[3] + " , UTMNorth:" + cordinates[4] + "]");

            }

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}