import json
import csv
import continent

index_lookup = {}
cols = ["ID", "Name", "Sex", "Age", "Height", "Weight", "Team", "NOC", "Games", "Year", "Season", "City", "Sport",
        "Event", "Medal"]

noc_lookup = continent.NOC_lookup
# print(noc_lookup.keys())
for index, val in enumerate(cols):
    index_lookup[val] = index


with open('athlete_events.csv', mode="r") as csvfile:
    records = csv.reader(csvfile, delimiter=',')

    summerRecords = list(filter(lambda x: x[10] == "Summer", records))
    summerRecordsByYear = {}
    for record in summerRecords:
        year = record[index_lookup["Year"]]
        if year not in summerRecordsByYear:
            summerRecordsByYear[year] = {}
        country = record[index_lookup["NOC"]]
        if country not in summerRecordsByYear[year]:
            summerRecordsByYear[year][country] = {}
            summerRecordsByYear[year][country]["participants"] = 0
            summerRecordsByYear[year][country]["male"] = 0
            summerRecordsByYear[year][country]["female"] = 0
            summerRecordsByYear[year][country]["medal"] = 0

        summerRecordsByYear[year][country]["participants"] += 1

        if record[index_lookup["Medal"]] != "NA":
            summerRecordsByYear[year][country]["medal"] += 1

        if record[index_lookup["Sex"]] == "F":
            summerRecordsByYear[year][country]["female"] += 1
        else:
            summerRecordsByYear[year][country]["male"] += 1

    years = []
    for year in summerRecordsByYear:
        arr = []
        for NOC in summerRecordsByYear[year]:
            summerRecordsByYear[year][NOC]["NOC"] = NOC
            summerRecordsByYear[year][NOC]["country"] = noc_lookup[NOC]["name"]
            summerRecordsByYear[year][NOC]["continent"] = noc_lookup[NOC]["continent"]

            arr.append(summerRecordsByYear[year][NOC])
        with open(year+'.json', 'w+') as outfile:
            json.dump(arr, outfile)

    print(summerRecordsByYear["2008"]["CHN"])
