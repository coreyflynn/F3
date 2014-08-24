import json
import collections

# the path to the file we are going to parse
filename = 'F3through0824.txt'

# set up a default dicitonary to hold our data
data = collections.defaultdict(lambda:collections.defaultdict(int))

# open the file
with open(filename, 'rU') as f:
	# grab the headers
	headers = f.readline()
	print(headers)

	# grab an array of all the lines in the file
	lines = f.readlines()

	# for each line in the file, grab the name and the workouts.
	# map the workouts to the players
	for line in lines:
		fields = line.split('\t')
		data[fields[0]]["abs"] = fields[2]
		data[fields[0]]["upper body"] = fields[3]
		data[fields[0]]["lower body"] = fields[4]
		data[fields[0]]["cardio"] = fields[5]
		data[fields[0]]["speed"] = fields[6]
		data[fields[0]]["stretching"] = fields[7]
		data[fields[0]]["throwing"] = fields[8]
		data[fields[0]]["other"] = fields[9]
		data[fields[0]]["veggies"] = fields[10]

		# name = fields[0]
		# workouts = fields[1].split(',')
		# for workout in workouts:
		# 	if "abs" in workout.lower():
		# 		data[name]["abs"] += 1
		# 	elif "veggies" in workout.lower():
		# 		data[name]["veggies"] += 1
		# 	elif "throwing" in workout.lower():
		# 		data[name]["throwing"] += 1
		# 	elif "cardio" in workout.lower():
		# 		data[name]["cardio"] += 1
		# 	elif "speed" in workout.lower():
		# 		data[name]["speed"] += 1
		# 	elif "upper body" in workout.lower():
		# 		data[name]["upper body"] += 1
		# 	elif "other" in workout.lower():
		# 		data[name]["other"] += 1
		# 	elif "veggies" in workout.lower():
		# 		data[name]["veggies"] += 1
		# 	elif "stretching" in workout.lower():
		# 		data[name]["stretching"] += 1
		# 	elif "lower body" in workout.lower():
		# 		data[name]["lower body"] += 1


with open('F3.json','w') as f:
	f.write(json.dumps(data))


# dump a new tab delimited file
with open('F3_compiled.txt','w') as f:
	f.write('name\tupper body\tlower body\tcardio\tspeed\tstretching\tthrowing\tother\tveggies\n')
	categories = ['upper body','lower body','cardio','speed','stretching','throwing','other','veggies']
	for name in data.keys():
		string = name
		for category in categories:
			string += '\t'
			string += str(data[name][category])
		string += '\n'
		f.write(string)
