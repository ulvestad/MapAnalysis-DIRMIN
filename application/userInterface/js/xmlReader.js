
var fs = require('fs');
var mv = require('mv');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );
//Using node.js to get an array with the files from the metadata folder




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


//function to fetch coordinates and filename, parameter is xmlfile
function xmlParserAndWriter(xml) {
  var east, west, north, south, i, xmlDoc, xmlData;
  xmlDoc = xml.responseXML;
  xmlData = [];

  east = parseInt(xmlDoc.getElementsByTagName("eastBP")[0].childNodes[0].nodeValue);
  north = parseInt(xmlDoc.getElementsByTagName("northBP")[0].childNodes[0].nodeValue);
  south = parseInt(xmlDoc.getElementsByTagName("southBP")[0].childNodes[0].nodeValue);
  west = parseInt(xmlDoc.getElementsByTagName("westBP")[0].childNodes[0].nodeValue);
  
  
  filename = xmlDoc.getElementsByTagName("mdFilename")[0].childNodes[0].nodeValue;
  
  width = east - west;
  height = north - south;
  X1 = width/4;
  Y1 = height/3;
  //console.log("Width:" , width , "," , " Height:" ,  height);
  console.log(filename)
  console.log("E:" , east, "W:",  west, "N:", north, "S:", south)
  console.log("X1: " , X1 , "Y1" , Y1)
  tempFilename = filename.split('.jpg')
  console.log(tempFilename[0])
  console.log("-----------------------------------")
  
  
  for (i=0; i<3; i++) {
    for(j=0; j<4; j++) {
      if ((j+4*i) < 10){
        finalFilename = tempFilename[0] + "-0" + (j+4*i) + ".jpg";
      }else{
        finalFilename = tempFilename[0] + "-" + (j+4*i) + ".jpg";
      }
      console.log("West: " , (west + (j * X1)));
      console.log("East: " , (west + ((j+1) * X1)));
      console.log("North: " , (north - (i * Y1)));
      console.log("South: " , (north - ((i+1) * Y1)));
      console.log("-----------------------------------")
      
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

function getAllxml(folderPath){
  var files = fs.readdirSync(folderPath);
  fs.readdir( folderPath, function( err, files ) {
    if( err ) {
      console.error( "Could not list the directory.", err );
      process.exit( 1 );
    } 

    files.forEach( function( file, index ) {
      extension = file.split(".")
      //if (path.extname(file) != '.xml'){
      if (extension[extension.length - 1] != "xml") {
        //console.log('Not a xml');
        return;
      }
      metadataFile(files, index, folderPath);
     });
  });
}