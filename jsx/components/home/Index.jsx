'use strict';

var React = require("react");
var FileDownload = require("./FileDownload.jsx");
var ResultRow = require('./ResultRow.jsx');

var Index = React.createClass({
  getInitialState: function() {
      return {
      };
  },

  componentDidMount: function() {
  },

  render: function() {
    return (
      <div className="pane">
        <table className="table-striped">
          <thead>
          <tr>
            <th>Stage</th>
            <th>Progress</th>
            </tr>
          </thead>
          <tbody id="dbrows">
            <tr>
              <td>Download Spack</td>
              <td>
                <FileDownload start={true} name="Spack" url="http://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz" />
              </td>
            </tr>
            <tr>
              <td>Install Git</td>
              <td>
                //
              </td>
            </tr>
            <tr>
              <td>Install ROSE</td>
              <td>
                //
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
});

module.exports = Index;
