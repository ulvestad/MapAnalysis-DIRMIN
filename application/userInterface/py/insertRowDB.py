"""
Filename: userInterface/ps/insertRowDB.py
@Author Group 13
 
Inserts a row in the database table "NewLocations"
 
Globals:
	conn - database connection

Input:
	sys.argv[1] - String: Filename of the image
	sys.argv[2] - Integer: UTMZone of the image
	sys.argv[3] - Integer: UTMEast of the image
	sys.argv[4] - Integer: UTMNorth of the image
	sys.argv[5] - Integer: UTMSouth of the image
	sys.argv[6] - Integer: UTMWest of the image
	sys.argv[7] - float: Score of the image

Output:
	Inserts a row in the database table "NewLocations"

Return:
	None

"""



#Imports used 
import sqlite3
import sys
#Sets up connnection and performs sql query to update database table using system arguments
conn = sqlite3.connect('db/QuarryLocations.db');
conn.execute('INSERT INTO NewLocations (ID,FileName,UTMZone,UTMEast,UTMNorth, UTMSouth, UTMWest, Score) VALUES (null,?,?,?,?,?,?,?)',(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7]))
conn.commit();
conn.close(); #Close the DB connection
sys.exit(0) #exit the process