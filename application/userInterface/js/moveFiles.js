var mv = require('mv');
var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );

//Needed to check file type
var path = require('path')


//Not needed, maybe later? -------------------------------------------------------------------------
function moveFile(sourcePath, filename, destPath){
	mv((sourcePath + '/' + filename), (destPath + '/' + filename), {clobber: false}, function(err) {
		// done. If 'dest/file' exists, an error is returned
		// with err.code === 'EEXIST'.
		console.log(sourcePath + '/' + filename, destPath + '/' + filename);
		console.log("File transfer of " + filename + " complete.");
	});
}
//-------------------------------------------------------------------------------------------------


//Moves all files from source folder to dest folder
function moveFolder(sourcePath, destPath){

	var moveFrom = sourcePath;
	var moveTo = destPath;

	// Loop through all the files in the temp directory
	fs.readdir( moveFrom, function( err, files ) {
        if( err ) {
            console.error( "Could not list the directory.", err );
            process.exit( 1 );
        } 

        files.forEach( function( file, index ) {
        	//Checks if the image is a .jpg, if not, don't move it
        	if (path.extname(file) != '.jpg'){
        		console.log('Not a jpg');
        		return;
        	}
            // Make one pass and make the file complete
            var fromPath = path.join( moveFrom, file );
            var toPath = path.join( moveTo, file );

            fs.stat( fromPath, function( error, stat ) {
                if( error ) {
                    console.error( "Error stating file.", error );
                    return;
                }

                if( stat.isFile() )
                    console.log( "'%s' is a jpg.", fromPath );
                else if( stat.isDirectory() )
                    console.log( "'%s' is a directory.", fromPath );

                fs.rename( fromPath, toPath, function( error ) {
                    if( error ) {
                        console.error( "File moving error.", error );
                    }
                    else {
                        console.log( "Moved file '%s' to '%s'.", fromPath, toPath );
                    }
                } );
            } );
        } );
	} );
}