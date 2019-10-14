aws batch submit-job --cli-input-json "
{
    \"jobName\": \"$1\",
    \"jobQueue\": \"pdi-batch-job-queue\",
    \"jobDefinition\": \"arn:aws:batch:us-west-2:544324728049:job-definition/pdi-aws-batch-test:3\",
    \"containerOverrides\": {
	\"vcpus\": $AWS_BATCH_VCPU,
	\"memory\": $AWS_BATCH_MEMORY,
        \"environment\": [
            {
                \"name\": \"PROJECT_S3_LOCATION\",
                \"value\": \"$2\"
            },
            {
                \"name\": \"PROJECT_STARTUP_JOB\",
                \"value\": \"$3\"
            },
            {
                \"name\": \"LOG_LEVEL\",
                \"value\": \"$4\"
            },
	    {
		\"name\": \"PENTAHO_DI_JAVA_OPTIONS\",
		\"value\": \"-XX:+AggressiveHeap\"
	    }
        ]
    },
    \"retryStrategy\": {
        \"attempts\": 1
    }
}
"

