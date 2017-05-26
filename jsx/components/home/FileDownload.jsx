'use strict';

var React = require('react');
var dispatcher = require("./dispatcher");
var emitter = require("./emitter");
var ProgressBar = require('react-progressbar.js')

var FileDownload = React.createClass({
  getInitialState: function() {
      return {
          progress: 0
      };
  },

  componentWillMount: function() {
      //
      // Add handler for progress changes
      //
      emitter.on("store-changed", function(percentage) {
          this.setState({
              progress: percentage
          });
      }.bind(this));

      //
      // Register dispatcher
      //
      dispatcher.register(function(payload) {
          switch (payload.type) {
              case "start-download":
                  this.download(this.progressNotifier);
                  break;
          }
      }.bind(this));
  },

  componentDidMount: function() {
      if (this.props.start) {
          dispatcher.dispatch({ type: "start-download" });
      }
  },

  progressNotifier: function(percentage) {
      emitter.emit("store-changed", percentage);
  },

  download: function(done) {
      var name = this.props.name;

      this._downloadFile({
          remoteFile: this.props.url,
          localDirectory: "/tmp/node",
          onProgress: function (received, total) {
              var percentage = (received * 100) / total;
              console.log(name + ': ' + percentage + "% | " + received + " bytes out of " + total + " bytes.");
              return done(percentage);
          }
      }).then(function() {
          //alert("File successfully downloaded");
      })
  },

  /**
   * Promise based download file method
   */
  _downloadFile: function(configuration) {
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
  },

  render: function() {
      var percentage = Math.round(this.state.progress);
      var progress = this.state.progress / 100;

      var options = {
          strokeWidth: 4,
          easing: 'easeInOut',
          duration: 1400,
          trailColor: '#eee',
          trailWidth: 1,
          svgStyle: {width: '100%', height: '100%'},
          from: {color: '#FFEA82'},
          to: {color: '#a8ed5a'},
          step: (state, bar) => {
            //bar.setText(Math.round(bar.value() * 100) + '%');
            bar.path.setAttribute('stroke', state.color);
          }
      };

      // For demo purposes so the container has some dimensions.
      // Otherwise progress bar won't be shown
      var containerStyle = {
      };

      return (
          <div class="progress-container">
              <ProgressBar.Line
                  progress={progress}
                  text={percentage + '%'}
                  options={options}
                  initialAnimate={true}
                  containerStyle={containerStyle}
                  containerClassName={'.progress-bar'} />
          </div>
      )
  }
});

module.exports = FileDownload;
