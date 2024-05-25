# Error Log Monitoring

This repository contains code for an error log monitoring platform. The platform is implemented in JavaScript and Dockerized for easy deployment.

## Features

- **Error Log Generation**: The `generate_input.js` script generates a test input file containing random error log entries and commands.
- **Error Log Processing**: The `test.js` script processes the generated test input file and computes statistics based on the provided commands.
- **Docker Support**: The repository includes a `Dockerfile` to build a Docker image for the error log monitoring platform, making it easy to deploy in any environment.

## Usage

1. Clone the repository to your local machine:
git clone https://github.com/souvik2222/Error-Log-Monitoring

2. Navigate to the repository directory:
cd error-log-monitoring

3. Build the Docker image:
docker build -t error-log-monitoring .

4. Run the Docker container:
docker run --rm -v "${PWD}:/usr/src/app" error-log-monitoring

5.Inspect output file:
cat output.txt

This command will generate a test input file and process it to compute statistics based on the provided commands.

To run in node.js
  1. To generate input file
     node generate_input.js
  2. To generate output
     node test.js 

## Files

- `generate_input.js`: Script to generate a test input file with random error log entries and commands.
- `test.js`: Script to process the generated test input file and compute statistics.
- `Dockerfile`: Dockerfile for building the Docker image.
- `README.md`: This file.
  



