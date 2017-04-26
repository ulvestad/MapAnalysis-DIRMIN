import sqlite3
import sys

conn = sqlite3.connect('db/QuarryLocations.db')
filename = sys.argv[1];
utmZone = sys.argv[2]
utmEast = sys.argv[3]
utmNorth = sys.argv[4]
utmSouth = sys.argv[5]
utmWest = sys.argv[6]

conn.execute('INSERT INTO PossibleLocations (ID,FileName,UTMZone,UTMEast,UTMNorth,UTMSouth,UTMWest,Score) VALUES (null,?,?,?,?,?,?,null)',(filename, utmZone, utmEast, utmNorth, utmSouth, utmWest))
conn.commit()
conn.close()
#Change to sys.exit when done
sys.exit(0)