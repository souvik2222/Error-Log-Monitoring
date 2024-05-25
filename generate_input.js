const fs = require("fs");

// Helper function to generate random integers within a given range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random floating-point numbers within a given range
function getRandomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Helper function to generate a random log type
function getRandomLogType() {
  const logTypes = [
    "INTERNAL_SERVER_ERROR",
    "BAD_REQUEST",
    "NOT_FOUND",
    "UNAUTHORIZED",
    "FORBIDDEN",
  ];
  return logTypes[getRandomInt(0, logTypes.length - 1)];
}

// Generate a log entry with a sequential timestamp
function generateLogEntry(timestamp) {
  const logType = getRandomLogType();
  const severity = getRandomFloat(1, 100);
  return `1 ${timestamp};${logType};${severity}`;
}

// Generate a random command
function generateCommand(baseTimestamp) {
  const commandType = getRandomInt(2, 4);
  let command = `${commandType} `;
  switch (commandType) {
    case 2:
      command += getRandomLogType();
      break;
    case 3:
      command += `${
        getRandomInt(0, 1) === 0 ? "BEFORE" : "AFTER"
      } ${baseTimestamp}`;
      break;
    case 4:
      command += `${
        getRandomInt(0, 1) === 0 ? "BEFORE" : "AFTER"
      } ${getRandomLogType()} ${baseTimestamp}`;
      break;
    default:
      break;
  }
  return command;
}

// Generate test input data
function generateTestInput(numLogs, numCommands) {
  const input = [];
  let baseTimestamp = 1609459200000; // Start timestamp (2021-01-01)

  for (let i = 0; i < numLogs + numCommands; i++) {
    if (getRandomInt(0, 1) === 0 && numLogs > 0) {
      input.push(generateLogEntry(baseTimestamp));
      baseTimestamp += getRandomInt(1, 100); // Increment timestamp by a random value between 1ms to 100ms
    } else {
      input.push(generateCommand(baseTimestamp));
    }
  }

  return input.join("\n");
}

// Write the generated test input to a file
const numLogs = 5; // Number of log entries
const numCommands = 5; // Number of commands
const testInput = generateTestInput(numLogs, numCommands);

fs.writeFileSync("test_input.txt", testInput);

console.log("Sequential test input file generated: test_input.txt");
