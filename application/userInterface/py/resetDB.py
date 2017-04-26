import sqlite3, sys

conn = sqlite3.connect('db/QuarryLocations.db')
#remove all content from table
conn.execute('DELETE FROM NewLocations')
conn.execute('DELETE FROM PossibleLocations')
conn.execute('VACUUM')
conn.commit()

conn.close()
sys.exit(0)
