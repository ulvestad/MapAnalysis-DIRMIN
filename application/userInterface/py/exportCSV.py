import csv
import sqlite3
import time
import os



conn = sqlite3.connect('../../db/QuarryLocations.db')
cursor = conn.execute('SELECT * FROM NewLocations')
result_set = cursor.fetchall()
conn.commit()
conn.close()

filename = "NewLocations(" +time.strftime("%d.%m.%Y")+ ").csv"

dir = os.path.dirname("./"+filename)
if not os.path.exists(dir):
    os.makedirs(dir)
with open(filename, "w") as f:
	for row in result_set:
		writer = csv.writer(f)
		print row[0]
		writer.writerows(row)

		




	



	


