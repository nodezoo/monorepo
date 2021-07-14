# Update Service

Listen for npm updates and trigger updates to package database.

Emit async `role:info,update:package` to trigger npm and github.  The
npm and github services (and later others - these are the package data
source services) should listen for this and then pull the latest data
for the package.

See https://github.com/npm/registry/blob/master/docs/follower.md

Local development uses seneca-mem-store - no persistent data.

Messages will be needed to stop and start listening in production.

This service cannot run as a lambda - will need to use aws fargate -
we will need to generate deployment config for this - task for RR.
https://www.serverless.com/blog/serverless-application-for-long-running-process-fargate-lambda
On AWS we use SNS to send the update messages with
seneca-sns-transport.




