import sqlite3, sys
conn = sqlite3.connect('resources/app/db/QuarryLocations.db')
#remove all content from table
conn.execute('DELETE FROM NewLocations')
conn.execute('DELETE FROM PossibleLocations')
conn.isolation_level = None
conn.execute('VACUUM')
conn.isolation_level = '' # <- note that this is the default value of isolation_level
conn.commit()

conn.close()
sys.exit(0)
