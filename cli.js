#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

const args = minimist(process.argv.slice(2))

let help = args.h || "no help"
var  north = parseFloat(args.n.toFixed(3))
let south = args.s
let east = args.e
var  west = args.w
var tze = args.t
var day = args.d
let prettyjson = args.j

//if (typeof north !== 'undefined') { north = parseFloat(north.toFixed(3))  }

if (help !== "no help") {
  var help_exit_code = show_help()
  if (help_exit_code != 0) { help_exit_code = 1 }
  process.exit(help_exit_code)
}

if (typeof tze == 'undefined') { tze = moment.tz.guess(); }

if (prettyjson) {
  north = 35
  west = 79
  day = 1
}

if (typeof day == 'undefined') {
  day = 1
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=-' + west + '&daily=weathercode&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=' + tze + '&past_days=' + day);

const data = await response.json();

if (prettyjson) {
  console.log(data)
  process.exit(0)
}

if (day == 0) {
  console.log("It is " + data.current_weather.temperature + " today.")
} else if (day > 1) {
  console.log("It will be " + data.current_weather.temperature + " degrees in " + day + " days.")
} else {
  console.log("It is " + data.current_weather.temperature + " degrees tomorrow.");
}

function show_help() {
  console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n")
  console.log("\n")
  console.log("  -h\t\tShow this help message and exit.\n")
  console.log("  -n, -s\tLatitude: N positive; S negative.\n")
  console.log("  -e, -w\tLongitude: E positive; W negative.\n")
  console.log("  -z\t\tTime zone: uses /etc/timezone by default.\n")
  console.log("  -d 0-6\tDay to retrieve weather: 0 is today; defaults to 1.\n")
  console.log("  -v\t\tVerbose output: returns full weather forecast.\n")
  console.log("  -j\t\tEcho pretty JSON from open-meteo API and exit.\n")

  return 0
}
