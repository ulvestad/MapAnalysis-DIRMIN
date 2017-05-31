"""

    Filename: userInterface/py/resetDB.py
    @Author: Group 13

    Description: Clears out all data from NewLocations and PossibleLocations tables
    in the database.

    Globals:
        conn - Database connection

    Input:
        None

    Output:
        Updated database

"""

import sqlite3, sys
# Makes database connection
conn = sqlite3.connect('db/QuarryLocations.db')

#remove all content from table
conn.execute('DELETE FROM NewLocations')
conn.execute('DELETE FROM PossibleLocations')
conn.isolation_level = None
conn.execute('VACUUM')
conn.isolation_level = '' # <- note that this is the default value of isolation_level
conn.commit()

# Close database connection
conn.close()
sys.exit(0)
