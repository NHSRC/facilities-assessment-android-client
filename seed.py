from __future__ import print_function
import json
from os import listdir
from os.path import isfile, join

RESPONSE_PATH = "../facilities-assessment-server/responses/"

file_list = filter(lambda f: isfile(join(RESPONSE_PATH, f)) and f.endswith(".json"), listdir(RESPONSE_PATH))
response_files_content = [json.load(open(join(RESPONSE_PATH, f), 'r')) for f in file_list]

entities_map = {}

for response_file_content in response_files_content:
    try:
        content = response_file_content["_embedded"]
        for k in content.keys():
            existing_val = entities_map.get(k, [])
            entities_map[k] = existing_val + content[k]
    except:
        pass

seed = "export default {};".format(json.dumps({"_embedded": entities_map}, separators=(',', ':')))

with open("src/config/seed.js", 'w') as fd:
    fd.write(seed)
