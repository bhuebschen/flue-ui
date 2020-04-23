module.exports = function(RED) {
    var path= require('path');
    var node;
    var flueJSONbuilder = require('../utils/flueJSONbuilder.js');

    function FlueUiNode(n) {
        RED.nodes.createNode(this,n);
        this.url = n.url;
        node = this;
    }

    RED.nodes.registerType("flue-ui",FlueUiNode);

    RED.httpAdmin.get('/flue/', function(req, res) {
        res.sendFile(path.join(__dirname, '../web/index.html'));
    });

    RED.httpAdmin.get('/flue/templates/*', function(req, res) {
        var filename = path.join(__dirname , '../web/templates', req.params[0]);
        res.setHeader('Content-Type','text/html');
        res.sendFile(filename, function (err) {
            if (err) {
                if (node) {
                    node.warn(filename + " not found. Maybe running in dev mode.");
                }
                else {
                    console.log("flue-ui - error:",err);
                }
            }
        });
    });

    RED.httpAdmin.post('/flue', function(req, res) {
        node.log(">"+req.body.id);
        node.emit(req.body.id, req.body);
        res.json({label: "test", value:0});
        //res.sendFile(path.join(__dirname, 'ui/index.html'));
    });

    RED.httpAdmin.get('/flue/pages/*/*/*', function(req, res) {
        // /Gebäude/Stockwerk/Raum
        res.json(JSON.stringify(req.params));
    });

    RED.httpAdmin.get('/flue/pages/*/*', function(req, res) {
        // /Gebäude/Stockwerk
        RED.flows.each(function(a) {
            this.log(a);
        });
        res.json(JSON.stringify(req.params));
    });

    RED.httpAdmin.get('/flue/pages/*', function(req, res) {
        var x = flueJSONbuilder.generateBuildings(RED.nodes);
        res.json(x);
    });

    RED.httpAdmin.get('/flue/css/*', function(req, res) {
        var filename = path.join(__dirname , '../web/css', req.params[0]);
        res.setHeader('Content-Type','text/css');
        res.sendFile(filename, function (err) {
            if (err) {
                if (node) {
                    node.warn(filename + " not found. Maybe running in dev mode.");
                }
                else {
                    console.log("flue-ui - error:",err);
                }
            }
        });
    });
}
