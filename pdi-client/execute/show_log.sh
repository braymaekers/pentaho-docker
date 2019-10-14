aws logs get-log-events --log-group-name /aws/batch/job --log-stream-name $1 | grep message

