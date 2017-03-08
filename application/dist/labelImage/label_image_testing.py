"""

Testing version of label_image.py

Used to run unit tests of the neural network and the prediction process for the application

"""
import tensorflow as tf, sys, os
import sqlite3
import unittest

def runNeuralNet(testFolder):
    #Added variable dir from parameter, since we will test with different types of maps (both quarries and not quarries)
    image_dir = testFolder
    #conn = sqlite3.connect('db/QuarryLocations.db')
    counter = 0

    # Loads label file, strips off carriage return
    label_lines = [line.rstrip() for line
                       in tf.gfile.GFile("retrained_labels.txt")]

    # Unpersists graph from file
    with tf.gfile.FastGFile("retrained_graph.pb", 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')

    with tf.Session() as sess:
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')

        for filename in os.listdir(image_dir):
            counter += 1
            if filename.endswith(".jpg"):
                filename = os.path.join(image_dir, filename)
                image_data = tf.gfile.FastGFile(filename, 'rb').read()
                predictions = sess.run(softmax_tensor, \
                         {'DecodeJpeg/contents:0': image_data})

                # Sort to show labels of first prediction in order of confidence
                top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]
                #print ("\n")
                #print (filename)
                for node_id in top_k:
                    human_string = label_lines[node_id]
                    score = predictions[0][node_id]
                    #print('%s (score = %.5f)' % (human_string, score))
                    if score > 0.65 and human_string == 'uttak':
                        """
                        In the real application the result is sent to the database and stored, here it is just returned
                        so that the unit test can check the result. The result is not stored.
                        """
                        return score
                        #line = open("coordinates.txt", "r").readlines()[counter-1]
                        #cordinates = line.replace('\n','').split(',')
                        #print('*************************  Found something  ***************************')
                        #print (cordinates)
                        #lat_data = cordinates[0]
                        #long_data = cordinates[1]
                        #conn.execute("INSERT INTO NewLocations (ID,Latitude,Longitude) VALUES (null, ?, ?)",(lat_data, long_data))
                        #conn.commit()
                    else:
                        return False
                continue
            else:
                continue
            conn.close()

class TestNeuralNet(unittest.TestCase):
    def test_notQuarry(self):
        self.assertFalse(runNeuralNet("testvanlig"))

    def test_quarry(self):
        self.assertGreater(runNeuralNet("testuttak"), 0.65)

if __name__ == "__main__":
    unittest.main()
