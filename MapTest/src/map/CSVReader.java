package map;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class CSVReader {

	public static void main(String[] args) {

		String csvFile = "C:/NTNU/uttak_konvertert2.txt"; //Filepath for csv file
		String line = ""; //Temporary variable for current line
		String cvsSplitBy = ",";

		//Array to store all coordinates
		ArrayList<ArrayList<String>> UTMkordinatListe = new ArrayList<ArrayList<String>>();
		//Array for each set of coordinates
		ArrayList<String> kordinater;

		//Variable to skip first line of input data (headers)

		//Loop trough the file, adding coordinates to the arraylists.
		try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
			while ((line = br.readLine()) != null) {
				// use , as separator
				String[] cordinates = line.split(cvsSplitBy);
				kordinater = new ArrayList<String>();
				kordinater.add(cordinates[3]);
				kordinater.add(cordinates[4]);
				UTMkordinatListe.add(kordinater);
				}
		} catch (IOException e) {
			e.printStackTrace();
		}

		for (ArrayList<String> list : UTMkordinatListe) {
			System.out.println(list.get(0) + "," + list.get(1));
		}

	}
}