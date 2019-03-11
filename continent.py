import csv

continent_lookup = {}
NOC_lookup = {}
with open('continents.txt', mode="r") as csvfile:
    records = csv.reader(csvfile, delimiter=';')
    for record in records:
        continent_lookup[record[1]] = record[0]

with open('noc_regions.csv', mode="r") as csvfile:
    records = csv.reader(csvfile, delimiter=',')
    next(records)
    for record in records:
        if record[1] in continent_lookup:
            NOC_lookup[record[0]] = {"continent": continent_lookup[record[1]], "name": record[1]}
        # else:
        #     print(record)
#
# print(continent_lookup.values())
NOC_lookup["AHO"] = {"continent": "South America", "name": 'Curacao'}
NOC_lookup["ANT"] = {"continent": "North America", "name": 'Antigua'}
NOC_lookup["CGO"] = {"continent": "Africa", "name": 'Republic of Congo'}
NOC_lookup["GBR"] = {"continent": "Europe", "name": 'UK'}
NOC_lookup["IOA"] = {"continent": "IOA", "name": 'Individual Olympic Athletes'}
NOC_lookup["ISV"] = {"continent": "North America", "name": 'Virgin Islands, US'}
NOC_lookup["IVB"] = {"continent": "North America", "name": 'Virgin Islands, British'}
NOC_lookup["ROT"] = {"continent": "ROT", "name": 'Refugee Olympic Team'}
NOC_lookup["SKN"] = {"continent": "North America", "name": 'Saint Kitts'}
NOC_lookup["STP"] = {"continent": "Africa", "name": 'Sao Tome and Principe'}
NOC_lookup["TLS"] = {"continent": "Asia", "name": 'Timor-Leste'}
NOC_lookup["TTO"] = {"continent": "Asia", "name": 'Trinidad and Tobago'}

NOC_lookup["TUV"] = {"continent": "Oceania", "name": 'Tuvalu'}
NOC_lookup["UNK"] = {"continent": "NA", "name": 'Unknown'}
NOC_lookup["USA"] = {"continent": "North America", "name": 'USA'}
NOC_lookup["VIN"] = {"continent": "North America", "name": 'Saint Vincent'}
NOC_lookup["WIF"] = {"continent": "Asia", "name": 'Trinidad'}


