# fargate-autoscale-time
This Lambda function will scale an AWS ECS service to a specific size. It is used by the Turnerlabs Fargate Terraform project.

This function can be installed multiple times within an account and then put on a schedule to combine into any number of scaling strategies. For example, create two instances of this function and set one to scale a service to your normal load during business hours and then another to scale down to off peak hours. Or even better, scale a service down to zero instances on a schedule if it is a development/testing instance to save money.

## Parameters
The lambda function expects these environment variables


Key  | Required? | Explanation | Example
----|-------------|-------- | ---
scale_to | Yes | How many tasks to scale the service up or down to. | 2
cluster | Yes | The name of the ECS cluster. | MyAwesomeApp
service | Yes | The name of the service within the ECS Cluster. | NiftyWebApiService
slack_webhook | No | A slack webhook to post to when the service scales. Leave it blank to skip. | https://hooks.slack.com/services/T....


It will need to run using an IAM role with the *ecs:UpdateService* action.

## FAQ
### Why create multiple instances of this function instead of installing it once and passing the required values as parameters?
This service is really intended to be paired with CloudWatch events, particularly on a schedule. CloudWatch can't easily pass in parameters. Putting the parameters as environment variables makes those values easily accessible.

### How does this work if I use AWS Auto Scaling?
In most cases an auto scale will override the scale_to values set by this function. They both operate on changing the task instance count of the service. However, if you set the service to zero using this function, it won't auto scale back up.
