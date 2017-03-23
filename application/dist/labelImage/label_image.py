import tensorflow as tf, sys, os
import sqlite3

image_dir = "maps"
log_filename = "log.txt"
log = open(log_filename, 'w')
conn = sqlite3.connect('db/QuarryLocations.db')
counter = 0
threshold = 0.65

# Loads label file, strips off carriage return
label_lines = [line.rstrip() for line 
                   in tf.gfile.GFile("graphs/retrained_labels.txt")]

# Unpersists graph from file
with tf.gfile.FastGFile("graphs/retrained_graph.pb", 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())
    _ = tf.import_graph_def(graph_def, name='')

with tf.Session() as sess:
    # Feed the image_data as input to the graph and get first prediction
    softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')

    try:
        for filename in os.listdir(image_dir):
            counter += 1
            if filename.endswith(".jpg"): 
                filename = os.path.join(image_dir, filename)
                image_data = tf.gfile.FastGFile(filename, 'rb').read()
                predictions = sess.run(softmax_tensor, \
                         {'DecodeJpeg/contents:0': image_data})
                
                # Sort to show labels of first prediction in order of confidence
                top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
                print ("\n")
                print (filename)
                log.write(filename +'\t')
                for node_id in top_k:
                    human_string = label_lines[node_id]
                    score = predictions[0][node_id]
                    print('%s (score = %.5f)' % (human_string, score))
                    log.write('%s (score = %.5f)\t' % (human_string, score))
                    if score > 0.65 and human_string == 'uttak':
                        line = open("coordinates.txt", "r").readlines()[counter-1]
                        cordinates = line.replace('\n','').split(',')
                        print('*************************  Found something  ***************************')
                        print (cordinates)
                        lat_data = cordinates[0]
                        long_data = cordinates[1]
                        scr = float(score)
                        scr = format(scr, ".5g")
                        conn.execute("INSERT INTO NewLocations (ID,Latitude,Longitude) VALUES (null, ?, ?)",(lat_data, long_data))
                        conn.commit()
                log.write('\n')
                continue
            else:
                continue
            conn.close()
            log.close()
    except:
        print("Some error occured")
        pass



"""
import tensorflow as tf, sys, os

image_path = sys.argv[1]

# Read in the image_data
image_data = tf.gfile.FastGFile(image_path, 'rb').read()

# Loads label file, strips off carriage return
label_lines = [line.rstrip() for line 
                   in tf.gfile.GFile("/tf_files/retrained_labels.txt")]

# Unpersists graph from file
with tf.gfile.FastGFile("/tf_files/retrained_graph.pb", 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())
    _ = tf.import_graph_def(graph_def, name='')

with tf.Session() as sess:
    # Feed the image_data as input to the graph and get first prediction
    softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
    
    predictions = sess.run(softmax_tensor, \
             {'DecodeJpeg/contents:0': image_data})
    
    # Sort to show labels of first prediction in order of confidence
    top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
    
    for node_id in top_k:
        human_string = label_lines[node_id]
        score = predictions[0][node_id]
        print('%s (score = %.5f)' % (human_string, score))
"""
