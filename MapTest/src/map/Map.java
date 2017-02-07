package map;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

public class Map {

	public static void main(String[] args) {
		JFrame test = new JFrame("Google Maps");

		try {
			String imageUrl = "https://maps.googleapis.com/maps/api/staticmap?center=66.119075893897,13.584447360715572&zoom=16&size=600x600&maptype=satellite&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyD8rXXlTRsfEiHBUlP6D-uIOjQPgHhBWtY";
			String destinationFile = "res/map.jpg";
			URL url = new URL(imageUrl);
			InputStream is = url.openStream();
			OutputStream os = new FileOutputStream(destinationFile);

			byte[] b = new byte[2048];
			int length;

			while ((length = is.read(b)) != -1) {
				os.write(b, 0, length);
			}

			is.close();
			os.close();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		}

		test.add(new JLabel(new ImageIcon((new ImageIcon("res/map.jpg")).getImage().getScaledInstance(600,
				600, java.awt.Image.SCALE_SMOOTH))));

		test.setVisible(true);
		test.pack();

	}

}
