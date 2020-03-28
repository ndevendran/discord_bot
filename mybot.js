const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var currentPoll = null;

function printPollResults(currentPoll) {
  if(currentPoll == null)
    return;

  var results = "Results:\n";
  for(i in currentPoll.pollResults) {
    const choice = parseInt(i) + 1;
    results += choice + ")" + currentPoll.questions[i] + " "
    + currentPoll.pollResults[i]+"\n";
  }

  return results;
}

function startPoll(questions, message) {
  if(questions == null || questions.length < 2) {
    message.channel.send("Usage !poll question1 question2...question(n)");
    return;
  }
  const pollTime = 300000;
  const repeatTime = 30000;
  const pollResults = [];
  for(question in questions) {
    pollResults.push(0);
  }

  var pollMessage = "Current Poll\n";
  for(i in questions) {
    const choice = parseInt(i) + 1;
    pollMessage += choice + ")" + questions[i]+"\n";
  }
  message.channel.send(pollMessage);


  const showPollHandle = setInterval(function() {
    message.channel.send(printPollResults()+"\n\n");
  }, repeatTime);

  const endPollHandle = setTimeout(function() {
    clearInterval(currentPoll.showPoll);
    var winner = null;
    var winnerScore = 0;
    for( i in currentPoll.pollResults) {
      if(currentPoll.pollResults[i] > winnerScore){
        winner = currentPoll.questions[i];
        winnerScore = currentPoll.pollResults[i];
      }
    }
    message.channel.send("Final Results:\n"
      + printPollResults() + "\n Winner: " + winner
      + "with a score of " + winnerScore + "\n"
    );
    currentPoll = null;
  }, pollTime);

  return { showPoll: showPollHandle,
           endPoll: endPollHandle,
           questions: questions,
           pollResults: pollResults,
           userVotes: {},
         };
}

function processVote(currentPoll, choice, message) {
  if(currentPoll.userVotes[message.author.username] == null){
    currentPoll.pollResults[(choice-1)]++;
    currentPoll.userVotes[message.author.username] = choice;
    message.channel.send(message.author.username + " voted for "
      + currentPoll.questions[choice-1]);
    message.channel.send(printPollResults()+"\n\n");
  } else {
    const previousChoice = currentPoll.userVotes[message.author.username];
    currentPoll.pollResults[(previousChoice-1)]--;
    currentPoll.pollResults[(choice-1)]++;
    currentPoll.userVotes[message.author.username] = choice;
    message.channel.send(message.author.username
      + " changed their vote to " + currentPoll.questions[choice-1]
    );
    message.channel.send(printPollResults()+"\n\n");
  }
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if(message.author.bot)
    return;

  if(!message.content.startsWith(config.prefix)){
    if(currentPoll != null) {
      if(message.content.length == 1) {
        const choice = parseInt(message.content);
        if(choice > 0 && choice <= currentPoll.pollResults.length) {
            processVote(currentPoll, choice, message);
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
      if(currentPoll == null) {
        message.channel.send("Starting poll...");
        currentPoll = startPoll(args, message);
      } else {
        message.channel.send("Already a poll underway...");
        message.channel.send(printPollResults());
      }

      break;
    case 'endpoll':
      if(currentPoll != null) {
        clearTimeout(currentPoll.showPoll);
        clearTimeout(currentPoll.endPoll);
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
