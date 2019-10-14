#!/bin/bash

# VARIABLES TO BE USED
# "PROJECT_S3_LOCATION" location of the ZIP file with the Pentaho ETL Jobs and Transformations to use
# "PROJECT_STARTUP_JOB" filename of the job to be executed
# "LOG_LEVEL" values are [Basic / Debug]

TMPDIR=/opt/pentaho/project
TMPFILE=${TMPDIR}/project.zip
BASENAME="${0##*/}"


usage () {
  if [ "${#@}" -ne 0 ]; then
    echo "* ${*}"
    echo
  fi
  cat <<ENDUSAGE
Usage:

export PROJECT_S3_LOCATION="s3://my-bucket/my-zip"
export PROJECT_STARTUP_JOB="my-job.kjb"
export LOG_LEVEL="Basic"
${BASENAME} load_and_execute.sh [ <script arguments> ]

ENDUSAGE

  exit 2
}

# Standard function to print an error and exit with a failing return code
error_exit () {
  echo "${BASENAME} - ${1}" >&2
  exit 1
}


# Check what environment variables are set
if [ -z "${PROJECT_S3_LOCATION}" ]; then
  usage "PROJECT_S3_LOCATION not set. No object to download."
fi

if [ -z "${PROJECT_STARTUP_JOB}" ]; then
  usage "PROJECT_STARTUP_JOB not set. No Job to execute"
fi

if [ -z "${LOG_LEVEL}" ]; then
  echo "LOG_LEVEL not set. using default Basic"
  LOG_LEVEL="Basic"
fi



# Create a temporary file and download the zip file
mkdir -p ${TMPDIR}
aws s3 cp "${PROJECT_S3_LOCATION}" - > "${TMPFILE}" || error_exit "Failed to download S3 zip file from ${PROJECT_S3_LOCATION}"

# Create a temporary directory and unpack the zip file
cd "${TMPDIR}" || error_exit "Unable to cd to temporary directory."
unzip -q "${TMPFILE}" || error_exit "Failed to unpack zip file."

kitchen.sh -file=${PROJECT_STARTUP_JOB}

