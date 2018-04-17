'use strict';

var AWS = require('aws-sdk');
var SlackWebhook = require('slack-webhook');

var ecs = new AWS.ECS({
  region:process.env.AWS_REGION
});

module.exports.handler = (event, context, callback) => {

  var params = {
    desiredCount: process.env.scale_to,
    cluster: process.env.cluster,
    service: process.env.service
  };
  ecs.updateService(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      logToSlack(process.env.service + ': ' + err);
    }
    else
    {
      var message = 'This service has been resized.\n```\nCluster: ' + params.cluster + '\nService: ' + params.service + '\nDesiredCount: ' + params.desiredCount + '```';
      console.log(message);
      logToSlack(message);
    }

    callback(err, {});
  });

};

function logToSlack(message) {
  if (!process.env.slack_webhook)
    return;
    
  var output = '';

  var slack = new SlackWebhook(process.env.slack_webhook);
  slack.send({
    text: message,
    username: 'Fargate Scale',
    icon_emoji: ':alarm_clock:'
  });
}
