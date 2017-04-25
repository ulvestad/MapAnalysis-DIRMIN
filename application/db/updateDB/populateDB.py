import sqlite3
import sys

#conn = sqlite3.connect('db/QuarryLocations.db')
skipFirstLine = True
counter = 0
csvFile = sys.argv[1]

with open(csvFile) as f:
    for line in f:
    	if(skipFirstLine):
    		skipFirstLine = False
    		continue
        #remove whitespace characters like `\n` at the end of each line
        content = line.strip()
        content = content.split(';')
        ##lat_data = content[1]
        #long_data = content[0]
        score = 1.0
        #print content
        print (counter, int(content[3]), int(content[4]))
        counter+=1
        #conn.execute('INSERT INTO KnownLocations (ID,Latitude,Longitude, Score) VALUES (null, ?, ?, ?)',(lat_data, long_data,score))
        #conn.commit()

#conn.close()
