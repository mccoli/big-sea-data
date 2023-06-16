import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D
import csv
import json

data = pd.read_csv('C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\tests\\new_underwater.csv')
# **ASCII CONVERSION**
# storing names in a list to perform ascii conversion
names = data['name']

# dict to store output conversions
#conversions = {}
conversions = []

for name in names: 
    converted_name = ''.join(str(ord(n)) for n in name)
    conversions.append({'name': name, 'conversion': converted_name.strip(',')})
    #conversions[name] = converted_name

print('conversions complete.')

# storing conversions in a new csv file
with open('uw-positions.csv', 'w', newline='') as csvfile:
    fieldnames = ['name', 'conversion']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writerows(conversions)

    print('data transferred to csv.')

# **UNDERWATER LOCATIONS**
# plotting each location on a 3d scatterplot
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

ax.scatter(data['lon'], data['lat'], data['depth'])
ax.set_xlabel('Longitude')
ax.set_ylabel('Latitude')
ax.set_zlabel('Depth')

#plt.show()

# SENDING LOCATION DATA TO HABITAT
# exporting data in json format (as a .js file) so it can be used as a variable in incorporated.js
location = [{"lon": data['lon'].tolist()}, 
            {"lat": data['lat'].tolist()},
            {"depth": data['depth'].tolist()}
            ]       

# print(location);

# convert the variables to JSON format
location_json = json.dumps(location)
conversions_json = json.dumps(conversions)

# solution found at: https://stackoverflow.com/questions/32284317/send-python-information-to-a-javascript-file by Michael Laszlo, 2015
with open('../addons/location.js', 'w') as out_file:
    out_file.write('locationData = %s;' % json.dumps(location))

# read data from javascript file
with open('../addons/incorporated.js', 'r') as in_file:
    contents = in_file.read()

# prepend new variable to its contents and write everything back into the file
with open('../addons/incorporated.js', 'w') as out_file:
    out_file.write('const locationData = %s;\n var conversions = %s;\n' % (location_json, conversions_json) + contents)

print("data transferred to javascript.")
