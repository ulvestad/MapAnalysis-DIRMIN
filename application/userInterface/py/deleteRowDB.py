"""

    Filename: userInterface/py/deleteRowDB.py
    @Author: Group 13

    Description: Deletes a specific row from PossibleLocations table in the database.

    Globals:
        conn - Database connection

    Input:
        ID for the row to be deleted.

    Output:
        Updated database

"""

# Imports required
import sqlite3
import sys

# Makes connection to database
conn = sqlite3.connect('db/QuarryLocations.db');
conn.execute('DELETE FROM PossibleLocations WHERE ID = ?',[sys.argv[2]]); #deletes a specific row
conn.commit();

# Close db connection
conn.close();
sys.exit(0)
