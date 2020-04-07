const Poll = require('./poll.js');
const PollPresenter = require('./poll_presentation');

const pollPresenter = new PollPresenter();

class PollController {
  printPollResults(poll) {
    pollPresenter.printPollResults(poll);
  }
  
  makePoll(questions, message) {
    if(questions == null || questions.length < 2) {
      message.channel.send("Usage !poll question1 question2...question(n)");
      return null;
    }

    const pollResults = [];
    for(var question in questions) {
      pollResults.push(0);
    }

    const poll = new Poll(
      questions,
      message,
      pollResults
    );

    return poll;
  }

  startPoll(poll, message) {
    const pollTime = 60000;
    const repeatTime = 30000;

    pollPresenter.printStartPollMessage(poll);

    const showPollHandle = setInterval((function() {
        pollPresenter.printPollResults(poll);
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
      pollPresenter.printWinnerMessage(poll, winner, winnerScore);
    }).bind(this), pollTime);

    poll.showPollHandle = showPollHandle;
    poll.endPollHandle = endPollHandle;

    return poll;
  }

  processVote(poll, choice, message) {
    const user = message.author.username;
    if(poll.userVotes[user] == null){
      poll.pollResults[(choice-1)]++;
      poll.userVotes[user] = choice;
      pollPresenter.printVoteMessage(poll, user, choice);
    } else {
      const previousChoice = poll.userVotes[user];
      poll.pollResults[(previousChoice-1)]--;
      poll.pollResults[(choice-1)]++;
      poll.userVotes[user] = choice;
      pollPresenter.printChangedVoteMessage(poll, user, choice);
    }
  }
}

module.exports = PollController;
