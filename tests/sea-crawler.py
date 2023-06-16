import requests
import pandas
import os
import json
import csv

# file for storing the data 
OUTPUT_FILE = "C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\tests\\sea-output.csv"

url = 'https://data.oceannetworks.ca/api/locations?method=getTree&token=064eb831-7a2e-4a2c-a66d-8076f3abbd75'

# making get request
response = requests.get(url)
print(response.status_code)

try:
    # turning the response into a json format
    data = response.json()
    # turning json data into a flat table
    df = pandas.json_normalize(data['items'])
    # outputting result to my file
    if os.path.exists(OUTPUT_FILE):
        df.to_csv(OUTPUT_FILE, mode='w', index=False)
        # df.to_excel('sea-output.xlsx', index=False)
    else:
        print("no file to write to :(")
except json.JSONDecodeError:
    # print the response content if JSONDecodeError is raised
    print(response.content)

with open('sea-output.csv') as csvfile:
    print("file opened successfully.")
    seaData = csv.DictReader(csvfile, delimiter=',')

