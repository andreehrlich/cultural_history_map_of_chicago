import csv
import json

from pprint import pprint
from geopy.geocoders import Nominatim


def json_dump(data, outfile_path):
    with open(outfile_path, 'w') as outfile:
            json.dump(data, outfile)

def json_load(infile_path):
    with open(infile_path, 'r') as infile:
        return json.load(infile)

#
# def fix_zipcode_coords():
#     zipcodes = json_load('./zipcodes.json')
#
#     for feature in zipcodes['features']:
#         print feature['properties']['ZIP']
#         fixed_coords = []
#         for coord in feature['geometry']['coordinates'][0]:
#             print coord
#             lat = coord[1]
#             long = coord[0]
#             fixed_coords.append([lat, long])
#
#         feature['geometry']['coordinates'][0] = fixed_coords
#         print "changed"
#         for coord in feature['geometry']['coordinates'][0]:
#             print coord
#
#     json_dump(zipcodes, 'zipcodes_fixed.json')


geolocator = Nominatim(user_agent="colonial_residue_map")

def address_to_coord(addr):

    try:
        location = geolocator.geocode(addr)
        # print((location.latitude, location.longitude))
        # print location.raw
        return [ location.longitude, location.latitude ]

    except:
        print "Geolocateor failed for {}".format(address)

        if "1130 Midway" in addr:
            return [ -87.598260, 41.787250 ]
        else:
            return [0, 0]


print address_to_coord('1227 w altgeld st, chicago, il 60614')

sites_json = {
    "type": "FeatureCollection",
    "features": []
}


with open('submissions.csv', 'rb') as f:
    reader = csv.reader(f)
    submissions = list(reader)

print "HELLO", sites_json['features']

for i, line in enumerate(submissions):
    # print line
    print "\n", i

    if i == 0:
        continue
    # for x in line:
        # print x

    date = line[0]
    email = line[1]
    author = line[2]
    place = line[3]
    address = line[4]
    coord = address_to_coord(address)
    image = line[5]
    description = line[6]


    # print "date: ", date
    # print "email: ", email
    # print "author: ", author
    # print "place: ", place
    # print "address: ", address
    # print "coord: ", coord
    # print "image: ", image
    # print "description: ", description


    feature_json = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": coord
        },
        "properties": {
            "name": place,
            "address": address,
            "description": description,
            "img": image,
            "investigator": author,
            "latitude": coord[0],
            "longitude": coord[1]
        }
    }
    sites_json['features'].append(feature_json)


pprint(sites_json)


json_dump(sites_json, 'sites.json')
