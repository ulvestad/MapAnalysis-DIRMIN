"""
 
    Filename: userInterface/js/updateDB.py
    @Author: Group 13
 
    Description: Sets up a connection and performs an SQL query to the database using sysargs
 
    Globals:
    	conn = Database connection
 
    Output:
        Updated database
 
"""

#IMPORTS USED BY SCRIPT-------------------------------------------------------------------------------------------------
import sqlite3
import sys

conn = sqlite3.connect('db/QuarryLocations.db')

#Updates the NewLocations table in the database with the variables specified with sysargs
conn.execute('UPDATE NewLocations SET UTMEast=?, UTMNorth=? WHERE ID=?',(sys.argv[1],sys.argv[2],sys.argv[3]))
conn.commit()

#Closes connection
conn.close() 
sys.exit(0)
