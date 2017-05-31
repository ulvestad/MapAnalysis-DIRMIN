"""
 
    Filename: userInterface/py/XMLupdateDB.py
    @Author: Group 13
 
    Description: Uses the XLM metadata accompanying each image to insert entries into database.
 
    Globals:
        conn
        filename - Source XML file
        utmZone - Which UTM zone the coordinates apply to
        utmEast - Easting of image
        utmNorth - Northing of image
        utmSouth - Southing of image
        utmWest - Westing of image
 
    Output:
        Updated database
 
"""


import sqlite3
import sys

#Set sysargs to respective variables
conn = sqlite3.connect('db/QuarryLocations.db')
filename = sys.argv[1];
utmZone = sys.argv[2]
utmEast = sys.argv[3]
utmNorth = sys.argv[4]
utmSouth = sys.argv[5]
utmWest = sys.argv[6]

#Add variables and execute SQL query
conn.execute('INSERT INTO PossibleLocations (ID,FileName,UTMZone,UTMEast,UTMNorth,UTMSouth,UTMWest,Score) VALUES (null,?,?,?,?,?,?,null)',(filename, utmZone, utmEast, utmNorth, utmSouth, utmWest))
conn.commit()

#Closes connection and exits
conn.close()
sys.exit(0)