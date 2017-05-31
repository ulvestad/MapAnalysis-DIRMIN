"""

    Filename: dist/pythonScript/label_image.py
    @Author: Group 13

    Description: Uses the TensorFlow library for python to parse the trained graph and predict
    if an input image is either quarry or not and update database accordingly.

    Globals:
        image_dir - Where to look for images to scan
        scanned_img_dir - Where to place images after they have been scanned
        conn - Database connection
        label_lines - Labels for output from graph. (e.g. quarry or nonquarry)

    Output:
        Updated database

"""

import tensorflow as tf, sys, os
import sqlite3
import sys
import shutil

image_dir = "maps/"
scanned_img_dir = "scannedMaps/"
conn = sqlite3.connect('db/QuarryLocations.db')

# Loads label file, strips off carriage return
label_lines = [line.rstrip() for line
                   in tf.gfile.GFile("graphs/retrained_labels.txt")]

# Unpersists graph from file
with tf.gfile.FastGFile("graphs/retrained_graph.pb", 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())
    del(graph_def.node[1].attr["dct_method"]) #needed for newGraphs
    _ = tf.import_graph_def(graph_def, name='')

#Starts session (comparable to main function for TensorFlow)
with tf.Session() as sess:
    # Feed the image_data as input to the graph and get first prediction
    softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
    try:
        for filename in os.listdir(image_dir):
            if filename.endswith(".jpg"):
                img_name = filename
                filename = os.path.join(image_dir, filename)

                # Read image file
                image_data = tf.gfile.FastGFile(filename, 'rb').read()
                predictions = sess.run(softmax_tensor, \
                         {'DecodeJpeg/contents:0': image_data})

                # Sort to show labels of first prediction in order of confidence
                top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]

                # Loop trough nodes to check results
                for node_id in top_k:
                    human_string = label_lines[node_id]
                    score = predictions[0][node_id]

                    # Only look for the quarry prediction
                    if human_string == 'quarry':
                        scr = float(score)
                        scr = format(scr, ".5g")

                        # Format filename
                        fileName = filename.split("/")
                        fileName = fileName[1]

                        # Update database based on results from parsing the neural net
                        conn.execute("UPDATE PossibleLocations SET Score = ? WHERE FileName = ?",(scr,fileName))
                        conn.commit()
                # Move from maps folder to scannedMaps folder
                shutil.move(filename, os.path.join(scanned_img_dir, img_name))
                continue
            else:
                continue
        # Close database connection
        conn.close()
    # Print exception
    except Exception as e:
        print(str(e))
        pass
