import os, sys
from scipy import misc
import numpy as np

map_dir = "../../maps/"
sliced_map_dir = map_dir + 'sliced/'

images = []

for filename in os.listdir(map_dir):
	if filename.endswith('.jpg'):
		#filename = os.path.join(map_dir, filename)
		images.append(filename)

if not os.path.exists(sliced_map_dir):
    os.makedirs(sliced_map_dir)

def slice_img(image_name, slice_width, slice_height):
	image = misc.imread(map_dir + image_name)
	height = len(image)
	width = len(image[0])
	new_height = height / slice_height
	new_width = width / slice_width

	new_images = []

	for j in range(slice_height):
		for i in range(slice_width):
			new_images.append(image[j * new_height : (j + 1) * new_height, i * new_width : (i + 1) * new_width])

	for i in range(len(new_images)):
		misc.imsave(sliced_map_dir + image_name.split('.')[0] + '-' + str(i) + '.jpg', new_images[i])


for img in images:
	slice_img(img, 4, 3)

