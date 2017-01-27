'use strict';

var React = require('react');

var ResultRow = React.createClass({
  render: function() {
    return (
        <tr>
          <td>{this.props.passed}</td>
          <td>{this.props.filename}</td>
          <td>{this.props.directory}</td>
          <td>{this.props.commandline}</td>
        </tr>
    )
  }
});

module.exports = ResultRow;
