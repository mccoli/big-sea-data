import requests
import pandas
import os
import json
import csv
import sys
# csv.field_size_limit(sys.maxsize) # set the field size limit to max size of my system

# # solution found at https://stackoverflow.com/questions/15063936/csv-error-field-larger-than-field-limit-131072 by user1251007
# while True:
#     # decrease the maxInt value by factor 10 
#     # as long as the OverflowError occurs.
#     try:
#         csv.field_size_limit(maxInt)
#         break
#     except OverflowError:
#         maxInt = int(maxInt/100)

# file for storing the data 
OUTPUT_FILE = "C:\\Users\\mccal\\Documents\\CCI\\big-data\\big-sea-data\\tests\\ocean-output.csv"

url = 'https://data.oceannetworks.ca/api/locations?method=getTree&token=064eb831-7a2e-4a2c-a66d-8076f3abbd75&locationCode=BACAX'
     # &locationCode=BACCC' 

# making get request
response = requests.get(url)
print(response.status_code)

try:
    # turning the response into a json format
    data = response.json()
    # turning json data into a flat table
    df = pandas.DataFrame(data)
    # outputting result to my file
    if os.path.exists(OUTPUT_FILE):
        df.to_csv(OUTPUT_FILE, mode='w', index=False) # the output is a list containing multiple dictionaries 
        #df.to_excel('ocean-output.xlsx', index=False)
    else:
        print("no file to write to :(")
except json.JSONDecodeError:
    # print the response content if JSONDecodeError is raised
    print(response.content)

with open('ocean-output.csv', newline='') as csvfile:
    print("file open successfully.")
    oceanReader = csv.DictReader(csvfile, delimiter=',')
    
    # initialize variables to store the dictionaries
    new_dict = None
    first_key = None

    # splitting up the list of dictionaries...
    for i, row in enumerate(oceanReader):
        if i == 0:
            new_dict = row
            # print(new_dict)
            break  # stop iterating after the parent dictionary is captured

    for i, row in enumerate(new_dict):
        if i == 0:
            first_key = row
            break

    for key, value in new_dict.items():
        if key == 'locationName':
            print(value)
    
    # print('first key: ', first_key)
    # print('new dict:', new_dict)
    
    #for ocean in oceanReader:
        #print(' - '.join(ocean))

    print("file closed.")
