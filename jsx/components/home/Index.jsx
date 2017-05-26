'use strict';

var React = require("react"),
    dispatcher = require("./dispatcher"),
    emitter = require("./emitter");

var ResultRow = require('./ResultRow.jsx');

var Index = React.createClass({
  getInitialState: function() {
      return {
          progress: 0,
          bar: 0
      };
  },

  componentWillMount: function() {

      var ProgressBar = require('progressbar.js');

      var ProgressBar = require('progressbar.js');
      var bar = new ProgressBar.Circle('#progress-container', {
        color: '#aaa',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#aaa', width: 1 },
        to: { color: '#333', width: 4 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);

          var value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(value);
          }

        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';

      emitter.on("store-changed", function(percent) {
          this.setState({
              progress: percent,
              bar: bar
          });
      }.bind(this));
  },

  componentDidMount: function() {
      dispatcher.dispatch({ type: "get-all-items" });
  },

  render: function() {
    var percent = Math.round(this.state.progress);

    return (
      <div className="pane">
        <table className="table-striped">
          <thead>
            <tr>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody id="dbrows">
            <tr>
              {percent}%
            </tr>
            <tr>
              <div id="progress-container"></div>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
});

var Download = function() {
    dispatcher.register(function(payload) {
        switch (payload.type) {
            case "get-all-items":
                this._all(this._notify);
                break;
        }
    }.bind(this));

    this._all = function(done) {
        this._downloadFile({
            remoteFile: "https://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz",
            localDirectory: "/tmp/node",
            onProgress: function (received,total){
                var percentage = (received * 100) / total;
                console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");

                bar.animate(percentage);  // Value from 0.0 to 1.0

                return done(percentage);
            }
        }).then(function(){
            //alert("File succesfully downloaded");
        })
    };

    this._notify = function(progress) {
        emitter.emit("store-changed", progress);
    };

    /**
     * Promise based download file method
     */
    this._downloadFile = function(configuration) {
        var request = require('request');
        var targz = require('node-tar.gz');

        return new Promise(function(resolve, reject) {
            // Save variable to know progress
            var received_bytes = 0;
            var total_bytes = 0;

            var req = request({
                method: 'GET',
                uri: configuration.remoteFile
            });

            var out = targz().createWriteStream(configuration.localDirectory);
            req.pipe(out);

            req.on('response', function ( data ) {
                // Change the total bytes value to get progress later.
                total_bytes = parseInt(data.headers['content-length' ]);
            });

            // Get progress if callback exists
            if(configuration.hasOwnProperty("onProgress")) {
                req.on('data', function(chunk) {
                    // Update the received bytes
                    received_bytes += chunk.length;

                    configuration.onProgress(received_bytes, total_bytes);
                });
            } else {
                req.on('data', function(chunk) {
                    // Update the received bytes
                    received_bytes += chunk.length;
                });
            }

            req.on('end', function() {
                resolve();
            });
        });
    }
};

var SpackDownload = new Download();

module.exports = Index;
