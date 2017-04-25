import sqlite3
import sys

conn = sqlite3.connect('../QuarryLocations.db')
skipFirstLine = True
counter = 0
csvFile = sys.argv[1]

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
        score = 1.0
        counter+=1
        #print sql statement
        #print('UPDATE KnownLocations SET (ID,UTMZone, UTMEast, UTMNorth) VALUES (null, ?, ?, ?) WHERE ID = ' + str(counter)+'',(utmZone,utmEast,utmNorth))
        conn.execute('INSERT INTO KnownLocations (ID,UTMZone,UTMEast,UTMNorth, Score)  VALUES (null,?,?,?,?)',(utmZone,utmEast,utmNorth, score))
        conn.commit()

conn.close()
    