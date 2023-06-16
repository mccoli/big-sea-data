import requests
import pandas
import os
import json
import csv

# file for storing the data 
OUTPUT_FILE = "C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\tests\\underwater.csv"

url = 'https://data.oceannetworks.ca/api/locations?method=get&token=064eb831-7a2e-4a2c-a66d-8076f3abbd75&locationName=underwater'
# making get request
response = requests.get(url)
print(f'request received with status code {response.status_code}.')

try:
    # turning the response into a json format
    data = response.json()
    # turning json data into a flat table
    df = pandas.json_normalize(data)
    # outputting result to my file
    if os.path.exists(OUTPUT_FILE):
        df.to_csv(OUTPUT_FILE, mode='w', index=False)
        # df.to_excel('sea-output.xlsx', index=False)
    else:
        print("no file to write to :(")
except json.JSONDecodeError:
    # print the response content if JSONDecodeError is raised
    print(response.content)

with open('underwater.csv') as csvfile:
    print("file opened successfully.")
    under_data = csv.DictReader(csvfile, delimiter=',')

    rows = [] # list to store all the rows of data

    #print('name - depth - lat - lon')
    for row in under_data:
        # collecting data for transfer to a program which gives visual output
        name = row['locationName']
        depth = row['depth']
        lat = row['lat']
        lon = row['lon']

        rows.append({'name': name, 'depth': depth, 'lat': lat, 'lon': lon})

        #print(f'{name}, {depth}, {lat}, {lon}')

    # storing data in a new csv file
    with open('new_underwater.csv', 'w', newline='') as new_csvfile:
        fieldnames = ['name', 'depth', 'lat', 'lon']
        writer = csv.DictWriter(new_csvfile, fieldnames=fieldnames)

        writer.writeheader() # write the header row
        writer.writerows(rows)
    
    print('data transferred.')

print('all files closed.')