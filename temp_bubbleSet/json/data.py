import json
import csv

years = ["1896", "1900", "1904", "1906", "1908", "1912", "1920", "1924", "1928", "1932", "1936", "1948", "1952", "1956", "1960", "1964", "1968", "1972", "1976", "1980", "1984", "1988", "1992", "1996", "2000", "2004", "2008", "2012", "2016"]

with open('data.csv', mode='w',encoding='utf-8') as csv_file:
    fieldnames = ['year', 'country','NOC', 'continent', 'participants', 'male', 'female','medal']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    for year in years:
        with open(year + '.json', mode="r",encoding='utf-8') as jsfile:
            data = json.load(jsfile)
            for d in data:
                writer.writerow({'year': year, 'country': d['country'],'NOC': d['NOC'],'continent': d['continent'],
                                 'participants': d['participants'],'male': d['male'], 'female': d['female'],'medal':d['medal']})






