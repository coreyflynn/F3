import json
import collections

# the path to the file we are going to parse
filename = 'F3through0721-txt.tsv'

# set up a default dicitonary to hold our data
data = collections.defaultdict(lambda:collections.defaultdict(int))

# open the file
with open(filename, 'rb') as f:
	# grab the headers
	headers = f.readline()
	
	# grab an array of all the lines in the file
	lines = f.readlines()
	
	# for each line in the file, grab the name and the workouts.
	# map the workouts to the players
	for line in lines:
		fields = line.split('\t')
		name = fields[0]
		workouts = fields[1].split(',')
		for workout in workouts:
			if "abs" in workout.lower():
				data[name]["abs"] += 1
			elif "veggies" in workout.lower():
				data[name]["veggies"] += 1
			elif "throwing" in workout.lower():
				data[name]["throwing"] += 1
			elif "cardio" in workout.lower():
				data[name]["cardio"] += 1
			elif "speed" in workout.lower():
				data[name]["speed"] += 1
			elif "upper body" in workout.lower():
				data[name]["upper body"] += 1
			elif "other" in workout.lower():
				data[name]["other"] += 1
			elif "veggies" in workout.lower():
				data[name]["veggies"] += 1
			elif "stretching" in workout.lower():
				data[name]["stretching"] += 1
			elif "lower body" in workout.lower():
				data[name]["lower body"] += 1


with open('F3through0721.json','w') as f:
	f.write(json.dumps(data))


# dump a new tab delimited file
with open('F3through0721_compiled.txt','w') as f:
	f.write('name\tupper body\tlower body\tcardio\tspeed\tstretching\tthrowing\tother\tveggies\n')
	categories = ['upper body','lower body','cardio','speed','stretching','throwing','other','veggies']
	for name in data.keys():
		string = name
		for category in categories:
			string += '\t'
			string += str(data[name][category])
		string += '\n'
		f.write(string)

