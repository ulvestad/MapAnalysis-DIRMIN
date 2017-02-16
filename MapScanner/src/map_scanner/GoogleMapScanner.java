package map_scanner;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class GoogleMapScanner {

	//generates images with increasing and unique filenames (.jpg files) from X and Y cordinates
	//uses Google Maps API
	public void aerialPhoto(String x, String y, int count){

		//double tempx = Double.parseDouble(x);
		double tempy = Double.parseDouble(y);

		//System.out.println(tempy+0.01);
		y = Double.toString(tempy + 0.02);


		try {
			String imageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+x+","+y+"&zoom=16&size=600x600&maptype=satellite&format=jpg&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyD8rXXlTRsfEiHBUlP6D-uIOjQPgHhBWtY";
			String destinationFile = "res/map"+count+".jpg";

			URL url = new URL(imageUrl);
			InputStream is = url.openStream();
			OutputStream os = new FileOutputStream(destinationFile);

			System.out.println(x + "," + y);

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

	}

	public void scan(){

	}

	public static void main(String[] args) {
		GoogleMapScanner gms = new GoogleMapScanner();

		double tempx = 62.91273185001395;
		double tempy = 12.05474853515625;
		int i = 0;
		while(tempy >= 7.26995849609375){
			i ++;
			tempy -= 0.0125;
			String x = String.valueOf(tempx);
			String y = String.valueOf(tempy);
			gms.aerialPhoto(x, y, i);
		}

	}
}
