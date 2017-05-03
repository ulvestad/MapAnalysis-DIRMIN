#IMPORTS USED BY SCRIPT-------------------------------------------------------------------------------------------------
import sqlite3
import sys
#SETS UP CONNECTION AND PERFORMS SQL QUERY TO DATABASE USING SYSTEM_ARGS-------------------------------------------------
conn = sqlite3.connect('db/QuarryLocations.db');
conn.execute('DELETE FROM ? WHERE ID = ?',(sys.argv[1]),sys.argv[1]); #deletes a specific row
conn.commit();
conn.close(); #CLOSE DB CONNETION
sys.exit(0)
