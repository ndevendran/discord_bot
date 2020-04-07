const PollController = require('../poll_controller.js');
const pollController = new PollController();

exports.run = (client, message, args) => {
  const channelId = message.channel.channelId;

  if(!client.pollList)
    client.pollList = {}

  var currentPoll = client.pollList[channelId];

  if(currentPoll == null || currentPoll.showPollHandle == null) {
    message.channel.send("Starting poll...");
    currentPoll = pollController.makePoll(args, message);
    if(currentPoll != null) {
      client.pollList[channelId] = currentPoll;
      pollController.startPoll(currentPoll, message);
    }
  }
  else {
    message.channel.send("Already a poll underway...");
    message.channel.send(pollController.printPollResults(currentPoll));
  }
}
