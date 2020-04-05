const Poll = require('./poll');

class PollPresenter {
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

  printWinnerMessage(poll, winner, score) {
    if(poll == null) {
      return;
    }

    poll.channel.send("Final Results:\n");
    this.printPollResults(poll)
    poll.channel.send("Winner: " + winner
      + " with a score of " + score + "\n"
    );
  }

  printVoteMessage(poll, user, choice) {
    poll.channel.send(user + " voted for "
      + poll.questions[choice-1]);
    this.printPollResults(poll);
  }

  printChangedVoteMessage(poll, user, choice) {
    poll.channel.send(user + " changed their vote to "
    + poll.questions[choice-1]);
    this.printPollResults(poll);
  }

  printStartPollMessage(poll) {
    var pollMessage = "Current Poll\n";
    for(var i in poll.questions) {
      const choice = parseInt(i) + 1;
      pollMessage += choice + ")" + poll.questions[i]+"\n";
    }
    poll.channel.send(pollMessage);
  }
}

module.exports = PollPresenter;
