#!/bin/sh

export AWS_BATCH_VCPU=$1
export AWS_BATCH_MEMORY=$2

echo usage set-cpu-memory.sh vCPU MEMORY
echo current values are:
echo AWS_BATCH_VCPU=$AWS_BATCH_VCPU
echo AWS_BATCH_MEMORY=$AWS_BATCH_MEMORY
