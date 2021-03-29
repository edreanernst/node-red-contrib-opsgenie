module.exports = function (RED) {
    var OG = require('./opsgenie_api.js');

    function OpsgenieAlertRead(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.params = RED.nodes.getNode(config.parameters);

        var og = new OG(node.params.apikey, node.params.version, node.params.apihost);

        node.on('input', function (msg) {
            
            if (node.params == null || 
                node.params.apikey == undefined || 
                node.params.version == undefined || 
                node.params.apihost == undefined) {
                node.error("No configuration defined!");

                return;
            }

            if (msg.action == undefined) {
                node.error("No action defined!");
                return;
            }

            switch (msg.action) {
                case 'list':

                    try {
                        og.getAlerts().then((aResult) => {
                            if (aResult.success) {
                                aResult.body.data.forEach(element => {
                                    node.send({
                                        event_type: "Opsgenie Alert",

                                        topic: "Opsgenie Alert",

                                        payload: element.message,
                                        data: element
                                    });
                                });
                            } else {
                                node.error("There was a problem reading the Opsgenie alerts: '" + aResult.error + "' - " + JSON.stringify(aResult.body));

                            }
                        });

                    } catch (error) {
                        node.error("There was a problem reading the Opsgenie alerts: '" + error.message + "'");

                    }
                    break;
                default:
                    node.error("No recognized action was defined, so nothing happened!");
                    break;
            }
        });
    }
    RED.nodes.registerType("OpsgenieAlertRead", OpsgenieAlertRead);
}
