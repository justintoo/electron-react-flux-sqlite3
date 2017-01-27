'use strict';

var React = require("react"),
    dispatcher = require("./dispatcher"),
    emitter = require("./emitter");

var ResultRow = require('./ResultRow.jsx');

var Index = React.createClass({
  getInitialState: function() {
      return {
          items: []
      };
  },

  componentWillMount: function() {
      emitter.on("store-changed", function(items) {
          this.setState({ items: items });
      }.bind(this));
  },

  componentDidMount: function() {
      dispatcher.dispatch({ type: "get-all-items" });
  },

  render: function() {
    var items = this.state.items;

    return (
      <div className="pane">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Passed</th>
              <th>Filename</th>
              <th>Directory</th>
              <th>Commandline</th>
            </tr>
          </thead>
          <tbody id="dbrows">
            {items}
          </tbody>
        </table>
      </div>
    )
  }
});

var Store = function() {
    dispatcher.register(function(payload) {
        switch (payload.type) {
            case "get-all-items":
                this._all(this._notify);
                break;
        }
    }.bind(this));

    this._all = function(done) {
        var sqlite3 = require('sqlite3').verbose();
        var file = '/tmp/electron-photon/dist/app/rose-results.db'
        var db = new sqlite3.Database(file);

        var larray = [];

        db.all("SELECT filename, directory, passed, commandline FROM results", function(err, rows) {
            // This code only gets called when the database returns with a response.
            rows.forEach(function(row) {
                larray.push(<ResultRow passed={row.passed} filename={row.filename} directory={row.directory} commandline={row.commandline}/>);
            })
            return done(larray);
        });
    };

    this._notify = function(items) {
        emitter.emit("store-changed", items);
    };
};

var ItemStore = new Store();

module.exports = Index;
