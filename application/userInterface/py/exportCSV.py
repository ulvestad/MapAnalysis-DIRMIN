"""

    Filename: userInterface/py/exportedCSV.py
    @Author: Group 13

    Description: Used to write a .csv file that contains all data in
	the NewLocations table from the database.

    Globals:
        conn - Database connection
		cursor - Contains all rows from NewLocations
		result_set - Same as cursor in different format
		path - Path to where .csv file should be placed

    Input:
        Path to where .cvs file should be placed.

    Output:
        .csv file containing database values

"""
# Imports required
import csv
import sqlite3
import time
import os
import sys

# Makes connection to database
conn = sqlite3.connect('db/QuarryLocations.db')
cursor = conn.execute('SELECT * FROM NewLocations')
result_set = cursor.fetchall()
conn.commit()

# Close db connection
conn.close()

# Finalize output path and filename
path = sys.argv[1] + "/"
filename = path + "NewLocations(" +time.strftime("%d.%m.%Y-%H.%M")+ ").csv"

# Loop for creating and then writing file
with open(filename, "wb") as f:
	# Sets splitter in csv file
	csv.excel.delimiter=';'
	writer = csv.writer(f, dialect=csv.excel)

	# Write line to csv file
	writer.writerow(["Identifier:","FileName:","UTMZone:","UTMEast:","UTMNorth:","UTMSouth:","UTMWest:","Score:"])
	# Fills in data to the row trough a loop
	for row in result_set:
		content = [str(row[0]),str(row[1]),str(row[2]),str(row[3]),str(row[4]),str(row[5]),str(row[6]),str(row[7])]
		writer.writerow(content)
sys.exit(0)
