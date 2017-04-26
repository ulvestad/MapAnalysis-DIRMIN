import os, sys
import shutil
from scipy import misc
import numpy as np

map_data_dir = "../../map_data.txt"
map_dir = "../../maps"

counter = 0
images = []
cutLogo = True

with open(map_data_dir, 'r') as f:
	size = f.read().strip().split(',')
	width = int(size[0])
	height = int(size[1])

row = []
for filename in os.listdir(map_dir):
	if counter < width and filename.endswith('.jpg'):
		filename = os.path.join(map_dir, filename)
		row.append(filename)
		counter += 1
	elif filename.endswith('.jpg'):
		images.append(row)
		row = []
		filename = os.path.join(map_dir, filename)
		row.append(filename)
		counter = 1
images.append(row)

def stitch(img1, img2, img3, img4):
	#print(tl.shape, tr.shape, bl.shape, br.shape)
	#print()
	tl = misc.imread(img1)
	tr = misc.imread(img2)
	bl = misc.imread(img3)
	br = misc.imread(img4)

	corrupted = None
	if tl.shape == ():
		corrupted = img1
	elif tr.shape == ():
		corrupted = img2
	elif bl.shape == ():
		corrupted = img3
	elif br.shape == ():
		corrupted = img4
		
	if corrupted != None:
		print('ERROR: Corrupted image (' + corrupted + '), stitching aborted.')
		sys.exit()

	top = np.concatenate((tl, tr), axis=1)
	bottom = np.concatenate((bl, br), axis=1)
	if cutLogo:
		top = top[0:len(top) - 22]
		bottom = bottom[0:len(bottom) - 22]
	return np.concatenate((top, bottom), axis=0)


stitched_images = []
img_names = []
for i in range(0, len(images), 2):
	for j in range(0, len(images[i]), 2):
		#print(images[i][j], images[i][j + 1], images[i + 1][j], images[i + 1][j + 1])
		img_names.append(images[i][j])
		stitched_images.append(stitch(images[i][j], 
									  images[i][j + 1], 
									  images[i + 1][j], 
									  images[i + 1][j + 1]))


with open(map_data_dir, 'w') as f:
	f.write(str(width / 2) + ',' + str(height / 2))

for filename in os.listdir(map_dir):
	os.remove(os.path.join(map_dir, filename))

for i in range(len(stitched_images)):
	misc.imsave(img_names[i], stitched_images[i])


print('Stitching complete!')