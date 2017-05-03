#IMPORTS USED BY SCRIPT-------------------------------------------------------------------------------------------------
import sqlite3
import sys
#SETS UP CONNECTION AND PERFORMS SQL QUERY TO DATABASE USING SYSTEM_ARGS-------------------------------------------------
conn = sqlite3.connect('db/QuarryLocations.db');
conn.execute('INSERT INTO ? (ID,UTMZone,UTMEast,UTMNorth) VALUES (null,?,?,?)',(sys.argv[1], sys.argv[2], sys.argv[3],sys.argv[4],sys.argv[5],,sys.argv[6],,sys.argv[7],,sys.argv[8],sys.argv[9]))
conn.commit();
conn.close(); #CLOSE DB CONNETION
sys.exit(0)
