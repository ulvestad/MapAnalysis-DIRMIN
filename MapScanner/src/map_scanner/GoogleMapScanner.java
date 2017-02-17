package map_scanner;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

public class GoogleMapScanner {

	//cordinates for scanning a rectangle
	private Double latTop;
	private Double latButtom;
	private Double longLeft;
	private Double longRigth;

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

			System.out.println(count+ ": "+x + "," + y);

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
		if(!checkIfReady()){
			return;
		}
		System.out.println("Ready to scan...");
		int i = 0;
		double templongRigth = getLongRigth();
		double templongLeft = getLongLeft();
		double templatTop = getLatTop();
		double templatButton = getLatButtom();
		boolean Done = false;

		while(!Done){
			i++;
			templongRigth-= 0.0125;
			String y = String.valueOf(templongRigth);
			String x = String.valueOf(templatButton);
			aerialPhoto(x, y, i);
			if(templongRigth <= templongLeft){
				templongRigth = getLongRigth();
				templatButton += 0.0125;
			}
			if(templatButton >= templatTop){
				Done = true;
			}

		}


	}


	private boolean checkIfReady() {
		if(latTop == null || latButtom == null || longLeft == null || longRigth == null){
			System.err.println("Please set Lat/Long coordinates for rectangle to scan");
			return false;
		}
		return true;
	}

	public Double getLatTop() {
		return latTop;
	}

	public void setLatTop(Double latTop) {
		this.latTop = latTop;
	}

	public Double getLatButtom() {
		return latButtom;
	}

	public void setLatButtom(Double latButtom) {
		this.latButtom = latButtom;
	}

	public Double getLongLeft() {
		return longLeft;
	}

	public void setLongLeft(Double longLeft) {
		this.longLeft = longLeft;
	}

	public Double getLongRigth() {
		return longRigth;
	}

	public void setLongRigth(Double longRigth) {
		this.longRigth = longRigth;
	}

	public static void main(String[] args) {

		GoogleMapScanner gms = new GoogleMapScanner();
		gms.setLongRigth(12.05474853515625);
		gms.setLongLeft(7.26995849609375);
		gms.setLatButtom(62.91273185001395);
		gms.setLatTop(63.68524808030715);

		//tests for accuracy of overlap
		String y = String.valueOf(gms.longRigth);
		String x = String.valueOf(gms.latButtom);
		gms.aerialPhoto(x, y, 1);

		String y1 = String.valueOf(gms.longRigth -0.0125);
		String x1 = String.valueOf(gms.latButtom);
		gms.aerialPhoto(x1, y1, 2);

		String y3 = String.valueOf(gms.longRigth);
		String x3 = String.valueOf(gms.latButtom + 0.0125);
		gms.aerialPhoto(x3, y3, 3);

		String y4 = String.valueOf(gms.longRigth -0.0125);
		String x4 = String.valueOf(gms.latButtom +0.0125);
		gms.aerialPhoto(x4, y4, 4);


		//gms.scan();

	}
}
