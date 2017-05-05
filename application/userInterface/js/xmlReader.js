
var fs = require('fs');
var mv = require('mv');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );
var allQuarryNames = [];

// ----------------------- INIT -------------------------
//Function to create file objects from the metadata directory, xmlNum = the xml file to be read
function metadataFile(files, xmlNum, folderPath) {

  //creating all files in the metadata folder
  var file = new File([""], files[0,xmlNum], {path: folderPath + '/' + files[0,xmlNum]});
  //console.log(file);
  url = folderPath + '/' + file.name;
  //console.log(url);

  //Creating HttpRequest for the specified file
  files = new XMLHttpRequest();
  //console.log(files);
  files.open("GET", url, true);
  //Checking if request is good, and sending xml file to xmlparser to parse the file
  files.onreadystatechange = function () {
    //console.log("onreadystatechange is run")
    if (files.readyState == 4 && files.status == 200) {
      //console.log("if sentence completed")
      xmlParserAndWriter(files);
    }
  }
  files.send();
}


/*function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}*/


//function to fetch coordinates and filename, parameter is xmlfile. Also runs py-file which writes to DB
function xmlParserAndWriter(xml) {
  //Fetches all rows from PossibleQuarries, so the program can loop through it later
  getAllPQNames();
  var east, west, north, south, i, xmlDoc;
  var breakFunc = false;
  xmlDoc = xml.responseXML;

  //Coordiantes for the original unsliced image
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
  //Filename without file ending (needed to add slice-num to end of filename)
  tempFilename = filename.split('.jpg')
  console.log("XML-filename: " , filename)
  console.log("E:", east, "N:", north, "S:", south, "W:", west )
  console.log("--------------SLICING IMAGE--------------")  
  
  //Loops through each image-coordinate 12 times and creates correct coordinates+filename for each sliced image
  for (i=0; i<3; i++) {
    for(j=0; j<4; j++) {
      if ((j+4*i) < 10){
        //Filename with added slice-num and file ending
        finalFilename = tempFilename[0] + "-0" + (j+4*i) + ".jpg";
      }else{
        finalFilename = tempFilename[0] + "-" + (j+4*i) + ".jpg";
      }
      console.log("E:", west + ((j+1) * X1), "N:", north - (i * Y1), "S:", north - ((i+1) * Y1), "W:", west + (j * X1));

      //checks if current image already is in DB
      allQuarryNames.forEach(function(x){
        if (finalFilename === x){
          console.log("Dupliace found, these 12 coordinates will not be saved.");
          breakFunc = true;
          return;
        }
      });
      //Breaks the entire function if there's a duplicate
      if (breakFunc){
        return;
      }
      //------------------------------------PYTHON FILE EXECUTION (SQL)------------------------------------------
      //Creates childProcess of pythonfile which saves this to potentialQuarries
      var spawn  = require("child_process").spawn; //spawns a childs proc.
      var child = spawn('python',["userInterface/py/XMLupdateDB.py", finalFilename, 33, west + ((j+1) * X1), north - (i * Y1), north - ((i+1) * Y1), west + (j * X1)]);
      //var child = spawn('python',["userInterface/py/XMLupdateDB.py", filename, 33, east, north, south, west]);
      
    }
  }

  /*var textToSave = xmlData;
  var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
  var fileNameToSaveAs = "coordinates.txt";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();*/
}
// -------------------------------------XML FILE ITERATION LOOP-------------------------------------------------
//Runs a getXMLfile-function once for each XML-file in the specified folder
function getAllxml(folderPath){
  var files = fs.readdirSync(folderPath);
  fs.readdir( folderPath, function( err, files ) {
    if( err ) {
      console.error( "Could not list the directory.", err );
      process.exit( 1 );
    } 
    //For each file in the folder:
    files.forEach( function( file, index ) {
      extension = file.split(".")
      //if (path.extname(file) != '.xml'){
      if (extension[extension.length - 1] != "xml") {
        //console.log('Not a xml');
        return;
      }
      //runs the getXML-function
      metadataFile(files, index, folderPath);
     });
  });
}

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