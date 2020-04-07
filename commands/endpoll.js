exports.run = (client, message, args) => {
  if(!client.pollList)
    client.pollList = {}

  const channelId = message.channel.channelId;
  const currentPoll = client.pollList[channelId];

  if(currentPoll == null || currentPoll.showPollHandle == null) {
    message.channel.send("No active polls...Use !poll q1 q2...q(n) to start one");
    return;
  } else {
    clearInterval(currentPoll.showPollHandle);
    clearTimeout(currentPoll.endPollHandle);
    client.pollList[channelId] = null;
    message.channel.send("Current poll cleared!");
  }

}
