const Poll = require('./poll.js');

class PollController {
  printPollResults(poll) {
    if(poll == null)
      return;

    var results = "Results:\n";
    for(var i in poll.pollResults) {
      const choice = parseInt(i) + 1;
      results += choice + ")" + poll.questions[i] + " "
      + poll.pollResults[i]+"\n";
    }

    poll.channel.send(results);
  }

  startPoll(questions, message) {
    if(questions == null || questions.length < 2) {
      message.channel.send("Usage !poll question1 question2...question(n)");
      return;
    }

    const pollTime = 60000;
    const repeatTime = 30000;
    const pollResults = [];
    for(var question in questions) {
      pollResults.push(0);
    }

    var pollMessage = "Current Poll\n";
    for(var i in questions) {
      const choice = parseInt(i) + 1;
      pollMessage += choice + ")" + questions[i]+"\n";
    }
    message.channel.send(pollMessage);

    const poll = new Poll(
      questions,
      message,
      pollResults
    );

    const showPollHandle = setInterval((function() {
        this.printPollResults(poll);
    }).bind(this), repeatTime);

    const endPollHandle = setTimeout((function() {
      clearInterval(poll.showPollHandle);
      poll.showPollHandle = null;
      var winner = null;
      var winnerScore = 0;
      for( var i in poll.pollResults) {
        if(poll.pollResults[i] > winnerScore){
          winner = poll.questions[i];
          winnerScore = poll.pollResults[i];
        }
      }
      message.channel.send("Final Results:\n");
      this.printPollResults(poll)
      message.channel.send("Winner: " + winner
        + " with a score of " + winnerScore + "\n"
      );
    }).bind(this), pollTime);

    poll.showPollHandle = showPollHandle;
    poll.endPollHandle = endPollHandle;

    return poll;
  }

  processVote(poll, choice, message) {
    if(poll.userVotes[message.author.username] == null){
      poll.pollResults[(choice-1)]++;
      poll.userVotes[message.author.username] = choice;
      message.channel.send(message.author.username + " voted for "
        + poll.questions[choice-1]);
      this.printPollResults(poll);
    } else {
      const previousChoice = poll.userVotes[message.author.username];
      poll.pollResults[(previousChoice-1)]--;
      poll.pollResults[(choice-1)]++;
      poll.userVotes[message.author.username] = choice;
      message.channel.send(message.author.username
        + " changed their vote to " + poll.questions[choice-1]
      );
      this.printPollResults(poll);
    }
  }
}

module.exports = PollController;
