const PollController = require("../poll_controller.js");
const pollController = new PollController();

exports.run = (client, message, args) => {
  if(args.length == 1) {
    if(!client.pollList)
      client.pollList= {};

    const currentPoll = client.pollList[message.channel.channelId];

    if(currentPoll == null)
      return;

    const choice = parseInt(args[0]);

    if(choice != undefined && choice > 0 && choice <= currentPoll.pollResults.length) {
        pollController.processVote(currentPoll, choice, message);
        return;
    }
  }

  message.channel.send("Usage: !vote n (where n is a number from 1 to 9)");
  return;
}
