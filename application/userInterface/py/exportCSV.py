import csv
import sqlite3
import time
import os

conn = sqlite3.connect('db/QuarryLocations.db')
cursor = conn.execute('SELECT * FROM NewLocations')
result_set = cursor.fetchall()
conn.commit()
conn.close()

filename = "exportedCSV/NewLocations(" +time.strftime("%d.%m.%Y-%H.%M")+ ").csv"

dire = os.path.dirname(filename)
if not os.path.exists(dire):
    os.makedirs(dire)
with open(filename, "wb") as f:
	csv.excel.delimiter=';'
	writer = csv.writer(f, dialect=csv.excel)
	writer.writerow(["Identifier:","FileName:","UTMZone:","UTMEast:","UTMNorth:","UTMSouth:","UTMWest:","Score:"])
	for row in result_set:
		content = [str(row[0]),str(row[1]),str(row[2]),str(row[3]),str(row[4]),str(row[5]),str(row[6]),str(row[7])]
		writer.writerow(content)
	#writer.writerows(result_set)

		




	



	


