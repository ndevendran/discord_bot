require('poll.js');

class PollController {
  printPollResults(poll) {
    if(poll == null)
      return;

    var results = "Results:\n";
    for(i in poll.pollResults) {
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

    poll = new Poll(
      questions,
      message,
      showPollHandle,
      pollResults
    );

    const endPollHandle = setTimeout(function() {
      clearInterval(poll.showPoll);
      var winner = null;
      var winnerScore = 0;
      for( i in poll.pollResults) {
        if(poll.pollResults[i] > winnerScore){
          winner = poll.questions[i];
          winnerScore = poll.pollResults[i];
        }
      }
      message.channel.send("Final Results:\n"
        + printPollResults() + "\n Winner: " + winner
        + "with a score of " + winnerScore + "\n"
      );
      poll = null;
    }, pollTime);

    poll.endPollHandle = endPollHandle;

    return poll;
  }

  function processVote(poll, choice, message) {
    if(poll.userVotes[message.author.username] == null){
      poll.pollResults[(choice-1)]++;
      poll.userVotes[message.author.username] = choice;
      message.channel.send(message.author.username + " voted for "
        + poll.questions[choice-1]);
      printPollResults(poll);
    } else {
      const previousChoice = poll.userVotes[message.author.username];
      poll.pollResults[(previousChoice-1)]--;
      poll.pollResults[(choice-1)]++;
      poll.userVotes[message.author.username] = choice;
      message.channel.send(message.author.username
        + " changed their vote to " + poll.questions[choice-1]
      );
      printPollResults(poll);
    }
}
