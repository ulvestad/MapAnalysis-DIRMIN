#IMPORTS USED BY SCRIPT-------------------------------------------------------------------------------------------------
import sqlite3
import sys

#SETS UP CONNECTION AND PERFORMS SQL QUERY TO DATABASE USING SYSTEM_ARGS-------------------------------------------------
conn = sqlite3.connect('db/QuarryLocations.db')
conn.execute('UPDATE NewLocations SET UTMEast=?, UTMNorth=? WHERE ID=?',(sys.argv[1],sys.argv[2],sys.argv[3])) #updates a specfic row
conn.commit()
conn.close() #CLOSE DB CONNETION
sys.exit(0)
