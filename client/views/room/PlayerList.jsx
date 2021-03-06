var React = require('react')

module.exports = React.createClass({
  displayName: 'PlayerList',
  propTypes: {
    players: React.PropTypes.array
  },
  render: function () {
    var players = []

    this.props.players.forEach(function (p) {
      players.push((
        <li ref={p.name}>{p.name}</li>
      ))
    })

    if (players.length === 0) {
      players = (
        <span>No one here!</span>
      )
    }

    return (
      <div>
        <h2>Players</h2>
        <ul>
          { players }
        </ul>
      </div>
    )
  }
})
