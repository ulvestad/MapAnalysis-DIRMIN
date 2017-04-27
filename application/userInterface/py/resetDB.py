import sqlite3, sys
print("yey c:")
conn = sqlite3.connect('db/QuarryLocations.db')
#remove all content from table
conn.execute('DELETE FROM NewLocations')
conn.execute('DELETE FROM PossibleLocations')
conn.isolation_level = None
conn.execute('VACUUM')
conn.isolation_level = '' # <- note that this is the default value of isolation_level
conn.commit()

conn.close()
sys.exit(0)