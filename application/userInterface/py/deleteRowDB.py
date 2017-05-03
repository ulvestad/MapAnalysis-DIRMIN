#IMPORTS USED BY SCRIPT-------------------------------------------------------------------------------------------------
import sqlite3
import sys
#SETS UP CONNECTION AND PERFORMS SQL QUERY TO DATABASE USING SYSTEM_ARGS-------------------------------------------------
conn = sqlite3.connect('db/QuarryLocations.db');
try:
	conn.execute('DELETE FROM PossibleLocations WHERE ID = ?',[sys.argv[2]]); #deletes a specific row
except Exception as e:
	print(str(e));

print("delete works");
conn.commit();
conn.close(); #CLOSE DB CONNETION
sys.exit(0)