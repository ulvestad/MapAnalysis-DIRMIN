package map;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class TextReader {

	public void gatherImageFromGoogleMaps(){

		String txtFile = "C:/NTNU/uttak_XY.txt"; // Filepath for txt file
		String line = ""; // Temporary variable for current line
		String txtSplitBy = ",";
		Map map = new Map();

		// Array to store all coordinates
		ArrayList<ArrayList<String>> UTMkordinatListe = new ArrayList<ArrayList<String>>();
		// Array for each set of coordinates
		ArrayList<String> kordinater;


		// Loop trough the file, adding coordinates to the arraylists.
		try (BufferedReader br = new BufferedReader(new FileReader(txtFile))) {
			while ((line = br.readLine()) != null) {
				// use , as separator
				String[] cordinates = line.split(txtSplitBy);
				kordinater = new ArrayList<String>();
				kordinater.add(cordinates[0]);
				kordinater.add(cordinates[1]);
				UTMkordinatListe.add(kordinater);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		int i = 0; // counter for number of images to make
		for (ArrayList<String> list : UTMkordinatListe) {
			System.out.println(list.get(0) + "," + list.get(1));
			map.aerialPhoto(list.get(1), list.get(0), i);
			// simple statement for controlling number of images to gather
			if (i + 1 > 20) {
				break;
			}
			i++;
		}
	}

	public static void main(String[] args) {
		TextReader tr = new TextReader();
		tr.gatherImageFromGoogleMaps();
	}
}