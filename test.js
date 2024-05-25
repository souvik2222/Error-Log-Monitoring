const fs = require("fs");

class ErrorLogMonitoring {
  constructor() {
    this.logs = [];
    this.logsByType = {};
  }

  addLog(timestamp, logType, severity) {
    const logEntry = {
      timestamp: parseInt(timestamp),
      logType: logType.trim(),
      severity: parseFloat(severity),
    };
    this.logs.push(logEntry);

    if (!this.logsByType[logType]) {
      this.logsByType[logType] = [];
    }
    this.logsByType[logType].push(logEntry);
  }

  computeStats(logEntries) {
    if (logEntries.length === 0) {
      return [0.0, 0.0, 0.0];
    }

    const severities = logEntries.map((entry) => entry.severity);
    const minSeverity = Math.min(...severities);
    const maxSeverity = Math.max(...severities);
    const meanSeverity =
      severities.reduce((a, b) => a + b, 0) / severities.length;

    return [minSeverity, maxSeverity, meanSeverity];
  }

  statsByType(logType) {
    if (!this.logsByType[logType]) {
      return [0.0, 0.0, 0.0];
    }
    return this.computeStats(this.logsByType[logType]);
  }

  statsBeforeTimestamp(timestamp) {
    const logsBefore = this.logs.filter((entry) => entry.timestamp < timestamp);
    return this.computeStats(logsBefore);
  }

  statsAfterTimestamp(timestamp) {
    const logsAfter = this.logs.filter((entry) => entry.timestamp > timestamp);
    return this.computeStats(logsAfter);
  }

  statsBeforeTimestampByType(logType, timestamp) {
    if (!this.logsByType[logType]) {
      return [0.0, 0.0, 0.0];
    }
    const logsBefore = this.logsByType[logType].filter(
      (entry) => entry.timestamp < timestamp
    );
    return this.computeStats(logsBefore);
  }

  statsAfterTimestampByType(logType, timestamp) {
    if (!this.logsByType[logType]) {
      return [0.0, 0.0, 0.0];
    }
    const logsAfter = this.logsByType[logType].filter(
      (entry) => entry.timestamp > timestamp
    );
    return this.computeStats(logsAfter);
  }
}

function processCommands(commands) {
  const monitoring = new ErrorLogMonitoring();
  const output = [];

  commands.forEach((command) => {
    const parts = command.split(" ");
    if (parts[0] === "1") {
      const [timestamp, logType, severity] = parts[1].split(";");
      monitoring.addLog(timestamp, logType, severity);
      output.push("No output");
    } else if (parts[0] === "2") {
      const logType = parts[1].trim();
      const [minS, maxS, meanS] = monitoring.statsByType(logType);
      output.push(
        `Min: ${minS.toFixed(6)}, Max: ${maxS.toFixed(
          6
        )}, Mean: ${meanS.toFixed(6)}`
      );
    } else if (parts[0] === "3") {
      const direction = parts[1];
      const timestamp = parseInt(parts[2]);
      if (direction === "BEFORE") {
        const [minS, maxS, meanS] = monitoring.statsBeforeTimestamp(timestamp);
        output.push(
          `Min: ${minS.toFixed(6)}, Max: ${maxS.toFixed(
            6
          )}, Mean: ${meanS.toFixed(6)}`
        );
      } else if (direction === "AFTER") {
        const [minS, maxS, meanS] = monitoring.statsAfterTimestamp(timestamp);
        output.push(
          `Min: ${minS.toFixed(6)}, Max: ${maxS.toFixed(
            6
          )}, Mean: ${meanS.toFixed(6)}`
        );
      }
    } else if (parts[0] === "4") {
      const direction = parts[1];
      const logType = parts[2].trim();
      const timestamp = parseInt(parts[3]);
      if (direction === "BEFORE") {
        const [minS, maxS, meanS] = monitoring.statsBeforeTimestampByType(
          logType,
          timestamp
        );
        output.push(
          `Min: ${minS.toFixed(6)}, Max: ${maxS.toFixed(
            6
          )}, Mean: ${meanS.toFixed(6)}`
        );
      } else if (direction === "AFTER") {
        const [minS, maxS, meanS] = monitoring.statsAfterTimestampByType(
          logType,
          timestamp
        );
        output.push(
          `Min: ${minS.toFixed(6)}, Max: ${maxS.toFixed(
            6
          )}, Mean: ${meanS.toFixed(6)}`
        );
      }
    }
  });

  return output;
}

// Read input file and process commands
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const commands = data.trim().split("\n");
  const results = processCommands(commands);

  // Write results to output file
  fs.writeFile("output.txt", results.join("\n"), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Results written to output.txt");
  });
});
