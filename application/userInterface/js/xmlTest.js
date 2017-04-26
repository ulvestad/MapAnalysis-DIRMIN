
var fs = require('fs');
var mv = require('mv');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );
//Using node.js to get an array with the files from the metadata folder
var files = fs.readdirSync('userInterface/metadata/');
var pictures = fs.readdirSync('userInterface/mapPictures');

getAllxml("userinterface/metadata/");

//Function to create file objects from the metadata directory, xmlNum = the xml file to be read
function metadataFile(files, xmlNum) {

  //creating all files in the metadata folder
  var file = new File([""], files[0,xmlNum], {path: "metadata/" + files[0,xmlNum]});
  //console.log(file);
  url = "metadata/" + file.name;
  //console.log(url);

  //Creating HttpRequest for the specified file
  files = new XMLHttpRequest();
  //console.log(files);
  files.open("GET", url, true);
  //Checking if request is good, and sending xml file to xmlparser to parse the file
  files.onreadystatechange = function () {
    console.log("onreadystatechange is run")
    if (files.readyState == 4 && files.status == 200) {
      console.log("if sentence completed")
      xmlparser(files);
    }
  }
  files.send();
}



/*function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}*/


//function to fetch coordinates and filename, parameter is xmlfile
function xmlparser(xml) {
  var east, west, north, south, i, xmlDoc, xmlData;
  xmlDoc = xml.responseXML;
  xmlData = [];

  east = xmlDoc.getElementsByTagName("eastBP")[0].childNodes[0].nodeValue;
  west = xmlDoc.getElementsByTagName("westBP")[0].childNodes[0].nodeValue;
  north = xmlDoc.getElementsByTagName("northBP")[0].childNodes[0].nodeValue;
  south = xmlDoc.getElementsByTagName("southBP")[0].childNodes[0].nodeValue;
  filename = xmlDoc.getElementsByTagName("mdFilename")[0].childNodes[0].nodeValue;
  xmlData.push(east,west,north,south, filename);
  console.log(xmlData);
  return xmlData;

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
  fs.readdir( folderPath, function( err, files ) {
    if( err ) {
      console.error( "Could not list the directory.", err );
      process.exit( 1 );
    } 

    files.forEach( function( file, index ) {
      metadataFile(files, index);
     });
  });
}