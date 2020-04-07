const Poll = require('./poll');
const Discord = require('discord.js');

class PollPresenter {
  printPollResults(poll) {
    if(poll == null)
      return;

    const avatarURL = `https://cdn.discordapp.com/avatars/${poll.author.id}/${poll.author.avatar}.png`

    const pollResultsEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle("Results")
      .setAuthor(poll.author.username, avatarURL, avatarURL)
      .setDescription('Current poll tally')
      .setTimestamp();

    for(var i in poll.pollResults) {
      const choice = parseInt(i) + 1;
      const fieldTitle = choice + ")" + poll.questions[i];
      pollResultsEmbed
        .addField(fieldTitle, poll.pollResults[i] + " votes", false);
    }

    poll.channel.send(pollResultsEmbed);
  }

  printWinnerMessage(poll, winner, score) {
    if(poll == null) {
      return;
    }

    const avatarURL = `https://cdn.discordapp.com/avatars/${poll.author.id}/${poll.author.avatar}.png`;

    const pollResultsEmbed = new Discord.MessageEmbed()
      .setTitle("Final Results:")
      .setDescription("Here are the final results of the poll started by "
        + poll.author.username)
      .setAuthor(poll.author.username, avatarURL);

    for(var i in poll.pollResults) {
      const choice = parseInt(i) + 1;
      const fieldTitle = choice + ")" + poll.questions[i];
      pollResultsEmbed
        .addField(fieldTitle, poll.pollResults[i] + " votes", false);
    }

    pollResultsEmbed.addField("Winner:", winner + " with a score of " + score, false)
    poll.channel.send(pollResultsEmbed);
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
    const avatarURL = `https://cdn.discordapp.com/avatars/${poll.author.id}/${poll.author.avatar}.png`;

    const pollEmbed = new Discord.MessageEmbed()
      .setTitle("Current Poll")
      .setAuthor(poll.author.username, avatarURL)
      .setDescription(poll.author.username + " started a poll!")
    for(var i in poll.questions) {
      const choice = parseInt(i) + 1;
      pollEmbed.addField(choice+")"+poll.questions[i], '0 votes', false);
    }
    poll.channel.send(pollEmbed);
  }
}

module.exports = PollPresenter;
