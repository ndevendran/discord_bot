const Discord = require("discord.js");
const PollController = require("./poll_controller.js");
const Poll = require("./poll.js");
const client = new Discord.Client();
const pollController = new PollController();
const config = require("./config.json");
var pollList = {};

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if(message.author.bot)
    return;

  const channelId = message.channel.id;
  var currentPoll = pollList[channelId];

  if(!message.content.startsWith(config.prefix)){
    if(currentPoll != null) {
      if(message.content.length == 1) {
        const choice = parseInt(message.content);
        if(choice > 0 && choice <= currentPoll.pollResults.length) {
            pollController.processVote(currentPoll, choice, message);
        }
      }
    }
    return;
  }

  const args = message.content.slice(config.prefix.length)
              .trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch(command) {
    case 'ping':
      message.channel.send("pong!");
      break;
    case 'poll':
      if(currentPoll == null || currentPoll.showPollHandle == null) {
        message.channel.send("Starting poll...");
        currentPoll = pollController.makePoll(args, message);
        if(currentPoll != null)
          pollList[channelId] = currentPoll;
          pollController.startPoll(currentPoll, message);
      } else {
        message.channel.send("Already a poll underway...");
        message.channel.send(pollController.printPollResults(currentPoll));
      }
      break;
    case 'endpoll':
      if(currentPoll != null && currentPoll.showPollHandle != null) {
        clearTimeout(currentPoll.showPollHandle);
        clearTimeout(currentPoll.endPollHandle);
        currentPoll = null;
        message.channel.send("Current poll cleared!");
      } else {
        message.channel.send("No polls active atm! Use !poll q1 q2...q(n) to start one");
      }
      break;
    default:
      message.channel.send("Current commands are: [!ping, !poll, !endpoll]");
      break;
  }
});

// client.on("guildMemberAdd", (member) => {
//   member.guild.channel.send("Welcome new member! <3 <3 <3");
// });

client.login(config.token);
