'use strict';

var React = require("react"),
    dispatcher = require("./home/dispatcher"),
    emitter = require("./home/emitter");

var Header = React.createClass({
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
    return (
      <header className="toolbar toolbar-header">
        <h1 className="title">{'Photon'}</h1>
      </header>
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
            }
        }).then(function(){
            alert("File succesfully downloaded");
        })
    };

    this._notify = function(items) {
        emitter.emit("store-changed", items);
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

//var SpackDownload = new Download();

module.exports = Header;
