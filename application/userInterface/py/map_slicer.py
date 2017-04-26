import os, sys
from scipy import misc
import numpy as np

"""
This script will slice 6400x4800 images into 12 new 1600x1600 images.
"""

# Sets up directories
map_dir = sys.argv[1]
map_dir += "/"
sliced_map_dir = 'maps/'

# Reads images in directory into array
images = []
for filename in os.listdir(map_dir):
	if filename.endswith('.jpg'):
		images.append(filename)

# Creates new subdirectory for the new images if it does not exist
if not os.path.exists("../../" + sliced_map_dir):
    os.makedirs(sliced_map_dir)

"""
Slices one image into 12 new ones
Parameters
image_name   : string, filename of image that will be sliced
slice_width  : int, number of new smaller images per column
slice_height : int, number of new smaller images per row
"""
def slice_img(image_name, slice_width, slice_height):
	# Read image into 2D array and sets up variables
	image = misc.imread(map_dir + image_name)
	height = len(image)
	width = len(image[0])
	new_height = height / slice_height
	new_width = width / slice_width
	new_images = []

	# Slices image into new smaller images, and appends tham to array
	for j in range(slice_height):
		for i in range(slice_width):
			new_images.append(image[j * new_height : (j + 1) * new_height, i * new_width : (i + 1) * new_width])

	# Saves the new images as .jpg files in the 'sliced' subdirectory
	for i in range(len(new_images)):
		if i < 10:
			misc.imsave(sliced_map_dir + image_name.split('.')[0] + '-0' + str(i) + '.jpg', new_images[i])
		else:
			misc.imsave(sliced_map_dir + image_name.split('.')[0] + '-' + str(i) + '.jpg', new_images[i])

# For each image call slice_img
for img in images:
	slice_img(img, 4, 3)

