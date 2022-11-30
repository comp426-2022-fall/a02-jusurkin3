#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

const args = minimist(process.argv.slice(2))
// const timezone = moment.tz.guest()
// var moment = require('moment-timezone');

let help = args.h || "no help"
let north = args.n
let south = args.s
let east = args.e
let west = args.w
var tze = args.z || "no tze"
let day = args.d || 1
let prettyjson = args.j

if (help !== "no help") {
  console.log(help)
  var help_exit_code = show_help()
  if (help_exit_code != 0) { help_exit_code = 1 }
}

if (tze === "no tze") { tze = moment.tz.guess(); }

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + north + '&longitude=-' + west + '&hourly=temperature_2m&daily=weathercode&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FNew_York&past_days=' + day);

const data = await response.json();

if (day == 0) {
  console.log("It is " + data.current_weather.temperature + " today.")
} else if (day > 1) {
  console.log("It will be " + data.current_weather.temperature + " degrees in " + day + " days.")
} else {
  console.log("It is " + data.current_weather + " degrees tomorrow.");
}

function show_help() {
  console.log("Usage: $0 [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n")
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
