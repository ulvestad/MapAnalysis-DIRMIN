"""
 
    Filename: userInterface/py/populateDB.py
    @Author: Group 13
 
    Description: Deletes all data from the KnownLocations table, and adds new data to it.
 
    Globals:
        conn - Database connection
        skipFirstLine - Skips first line containing .CSV field descriptors
        counter - Counts entries in the database
        csvFile - Source file
    Output:
        Updated database
 
"""

import sqlite3
import sys

conn = sqlite3.connect('db/QuarryLocations.db')
skipFirstLine = True
counter = 0
csvFile = sys.argv[1]
print (csvFile)

#removes all content from table
conn.execute('DELETE FROM KnownLocations')
conn.execute('VACUUM')
conn.commit()

#insert new content into table
with open(csvFile) as f:
    for line in f:
        #Skips field descriptors if skipFirstLine == true
    	if(skipFirstLine):
    		skipFirstLine = False
    		continue
        
        #remove whitespace characters like `\n` at the end of each line
        content = line.strip()

        #Splits each line and updates variables
        content = content.split(';')
        utmZone = int(content[2])
        utmEast = int (content[3])
        utmNorth = int(content[4])
        counter+=1

        #Inserts variables into SQL query and executes
        conn.execute('INSERT INTO KnownLocations (ID,UTMZone,UTMEast,UTMNorth)  VALUES (null,?,?,?)',(utmZone,utmEast,utmNorth))
        conn.commit()
        
#Closes connection and exits
conn.close()
sys.exit(0)    
