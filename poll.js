class Poll {
  constructor(questions, message, showPoll, pollResults) {
    this._pollResults = pollResults;
    this._questions = questions;
    this._channel = message.channel;
    this._showPollHandle = showPoll;
    this._endPollHandle = endPoll;
    this._userVotes = {};
  }

  get pollResults() {
    return this._pollResults;
  }

  get questions() {
    return this._questions;
  }

  get channel() {
    return this._channel;
  }

  get showPollHandle() {
    return this._showPollHandle;
  }

  get endPollHandle() {
    return this._endPollHandle;
  }

  get userVotes() {
    return this._userVotes;
  }

  set userVotes(key, value) {
    this._userVotes[key] = value;
  }

  set pollResults(index, value) {
    this._pollResults[index] = value;
  }

  set endPollHandle(endPollHandle) {
    this._endPollHandle = endPollHandle;
  }

  clearPoll() {
    clearInterval(this._showPollHandle);
    clearTimeout(this._endPollHandle);
  }
}
