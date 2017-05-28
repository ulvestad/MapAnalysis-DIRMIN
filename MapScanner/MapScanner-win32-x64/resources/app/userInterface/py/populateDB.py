import sqlite3
import sys

conn = sqlite3.connect('resources/app/db/QuarryLocations.db')
skipFirstLine = True
counter = 0
csvFile = sys.argv[1]
print (csvFile)

#remove all content from table
conn.execute('DELETE FROM KnownLocations')
conn.execute('VACUUM')
conn.commit()

#insert new content into table
with open(csvFile) as f:
    for line in f:
    	if(skipFirstLine):
    		skipFirstLine = False
    		continue
        #remove whitespace characters like `\n` at the end of each line
        content = line.strip()
        content = content.split(';')
        utmZone = int(content[2])
        utmEast = int (content[3])
        utmNorth = int(content[4])
        counter+=1
        #print sql statement
        #print('INSERT INTO KnownLocations (ID,UTMZone,UTMEast,UTMNorth, Score)  VALUES (null,?,?,?,?)',(utmZone,utmEast,utmNorth, score))
        conn.execute('INSERT INTO KnownLocations (ID,UTMZone,UTMEast,UTMNorth)  VALUES (null,?,?,?)',(utmZone,utmEast,utmNorth))
        conn.commit()

conn.close()
sys.exit(0)
