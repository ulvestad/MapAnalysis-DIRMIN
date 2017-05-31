/*
Filename: userInterface/js/xmlReader.js
@Author Group 13

Reads the XML metadata files in the selected folder(s), fetches the needed fields in the XML file, and exports the data to the SQLite database.

Globals:
	fs - Includes module for file system
  mv - Includes module for moving files
  path - Includes module for file path
  process - Includes module for process
  allQuarryNames - List of all quarry names
  xmlReaderFolderPath - Folder path to the xml files that is to be read
  xmlFileIndexes - List of indexes for all xml files
  scannedXmlNum - Number of xml files currently read
*/

/*
Inputs:
- metadataFile
-
Outputs:
- None

Returns:
- None

*/

var fs = require('fs');
var mv = require('mv');
var path = require('path');
var process = require( "process" ); // In newer Node.js versions where process is already global this isn't necessary.
var allQuarryNames = [];
var xmlReaderFolderPath = "";
var xmlFileIndexes = [];
var scannedXmlNum = 0;

/*

Function to create file objects from the metadata directory, xmlNum = the xml file to be read

Inputs:
- metadataFile

Outputs:
- xml file if http request is good

Returns:
- None

*/

function metadataFile(xmlNum) {
  url = xmlReaderFolderPath + '\\' + files[xmlNum]; //Url to next XML-file
  tempfiles = new XMLHttpRequest(); //HttpRequest for file
  tempfiles.open("GET", url, true); //get that file
  //request good?, send xml file to xmlparser
  tempfiles.onreadystatechange = function () { //Event listener that isn't launched until file is ready
    if (tempfiles.readyState == 4 && tempfiles.status == 200) {
      xmlParserAndWriter(tempfiles); //Run the parsing of that file
    }
  }
  tempfiles.send();
}

/*

Function to fetch coordinates and filename, parameter is xmlfile. Also runs py-file which writes to DB

Inputs:
- xml data

Outputs:
- Stores fetched xml data in SQLite database

Returns:
- None

*/

function xmlParserAndWriter(xml) {
  getAllPQNames(); //Get rows from PossibleQuarries, needed to check duplicates
  var east, west, north, south, i, xmlDoc;
  var breakFunc = false; //For duplicate check
  xmlDoc = xml.responseXML;

  //Coordiantes for xml-unsliced image
  east = parseInt(xmlDoc.getElementsByTagName("eastBP")[0].childNodes[0].nodeValue);
  north = parseInt(xmlDoc.getElementsByTagName("northBP")[0].childNodes[0].nodeValue);
  south = parseInt(xmlDoc.getElementsByTagName("southBP")[0].childNodes[0].nodeValue);
  west = parseInt(xmlDoc.getElementsByTagName("westBP")[0].childNodes[0].nodeValue);
  filename = xmlDoc.getElementsByTagName("mdFilename")[0].childNodes[0].nodeValue;

  //Width & height of this image in coordinates (1 coordinate = 1pixel)
  width = east - west;
  height = north - south;
  //Width & height of 1 sliced image
  X1 = width/4;
  Y1 = height/3;
  tempFilename = filename.split('.jpg'); //Filename without file ending (needed to add slice-num to end of filename)


  //Loops through each image-coordinate 12 times and creates correct coordinates+filename for each sliced image
  for (i=0; i<3; i++) {
    for(j=0; j<4; j++) {
      if ((j+4*i) < 10){
        finalFilename = tempFilename[0] + "-0" + (j+4*i) + ".jpg"; //Filename with added slice-num and file ending
      }else{
        finalFilename = tempFilename[0] + "-" + (j+4*i) + ".jpg";
      }
      allQuarryNames.forEach(function(x){ //checks if current image already is in DB
        if (finalFilename === x){
          console.log("Row below is duplicate, this row will be ignored.");
          breakFunc = true;
        }
      });
      //------------------------------------PYTHON FILE EXECUTION (SQL)------------------------------------------
      //Creates Synchronous childProcess of pythonfile which saves this to potentialQuarries
      if (!breakFunc){
        var spawnSync  = require("child_process").spawnSync; //spawns a childs proc.
        var child = spawnSync('python',["userInterface/py/XMLupdateDB.py", finalFilename, 33, west + ((j+1) * X1), north - (i * Y1), north - ((i+1) * Y1), west + (j * X1)]);
      }else{
        breakFunc = false;
      }
    }
  }
  console.log(filename, ", E:", east, "N:", north, "S:", south, "W:", west ) //Coords of unsliced img/xml
  scannedXmlNum += 1;
  if (scannedXmlNum < xmlFileIndexes.length) { //Runs the same set of functions again
    metadataFile(xmlFileIndexes[scannedXmlNum]);
  }else{
    scannedXmlNum = 0; //All xml files in folder are scanned, resets for new folder
  }
}

/*

Runs a getXMLfile-function once for each XML-file in the specified folder

Inputs:
- Path to xml data folder

Outputs:
- None

Returns:
- None

*/

function getAllxml(folderPath){
  xmlFileIndexes = [];
  files = fs.readdirSync(folderPath);
  xmlReaderFolderPath = folderPath;

  fs.readdir( folderPath, function( err, files ) { //Foldercheck
    if( err ) {
      console.error( "Could not list the directory.", err );
      process.exit( 1 );
    }
  });
  //For each file in the folder:
  for(x=0; x<files.length; x++){
    extension = files[x].split(".");
    eksport = files[x].split("-")[0];
    if (extension[extension.length - 1] === "xml" && eksport != "Eksport") {
      xmlFileIndexes.push(x); //Push all positions of .xml files in the folder to xmlFileIndexes[]
    }
  };
  metadataFile(xmlFileIndexes[0]); //Run the scan for the first .xml file
}

/*

Get all rows(filenames) in PossibleLocations from db and save in allQuarryNames[]

Inputs:
- none

Outputs:
- None

Returns:
- None

*/

function getAllPQNames(){
  var fs = require('fs')
  var sql = require('sql.js')
  var bfr = fs.readFileSync('../application/db/QuarryLocations.db')
  var db = new sql.Database(bfr);
  allQuarryNames = [];
  //Query to select x number of rows from the DB based on low and high threshold
  db.each('SELECT FileName as fn FROM PossibleLocations', function (row) {
    str = JSON.stringify(row);
    var fn = row.fn;
    allQuarryNames.push(fn);
  })
  db.close();
}
