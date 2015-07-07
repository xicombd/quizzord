var QUESTION_TIMEOUT = 10000
var QUESTIONS_INTERVAL = 2000

var Game = function (socket, game, room) {
  this.socket = socket
  this.game = game
  this.roomId = game.roomId
  this.questions = game.questions
  this.players = room.players
  this.rounds = []

  this.currentRoundIndex = 0

  this.startRound()
}

Game.prototype.broadcast = function (eventName, data) {
  data.roomId = this.roomId
  this.socket.emit(eventName, data)
}

Game.prototype.startRound = function () {
  console.log('start round')

  var self = this
  var question = this.questions[this.currentRoundIndex]
  var round = {
    question: question,
    startTime: new Date(),
    responses: {},
    finished: []
  }
  round.timeout = setTimeout(function () {
    self.endRound()
  }, QUESTION_TIMEOUT)

  self.rounds.push(round)

  this.broadcast('room:game:round:start', {
    question: {
      kind: question.kind,
      question: question.question,
      options: question.options
    }
  })
}

Game.prototype.endRound = function () {
  console.log('end round')
  var self = this
  var round = this.rounds[this.currentRoundIndex]

  this.currentRoundIndex++

  this.broadcast('room:game:round:end', { responses: round.responses })

  if (this.currentRoundIndex >= this.rounds.length) {
    return setTimeout(function () {
      self.endGame()
    }, QUESTIONS_INTERVAL)
  }

  setTimeout(function () {
    self.startRound()
  }, QUESTIONS_INTERVAL)
}

Game.prototype.endGame = function () {
  console.log('end game')
}

Game.prototype.handleAnswer = function (data) {
  console.log('handle answer', data)
  var round = this.rounds[this.currentRoundIndex]

  round.finished.push(data.playerId)
  round.responses[data.playerId] = {
    playerId: data.playerId,
    answer: data.answer,
    time: new Date() - round.startTime,
    isCorrect: data.answer === round.question.correct
  }

  if (round.finished.length === this.players.length) {
    clearTimeout(round.timeout)
    this.endRound()
  }

  console.log('updated round', round)
}

module.exports = Game