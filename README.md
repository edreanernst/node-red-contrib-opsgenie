# Opsgenie nodes Node-RED

[![Platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
![License](https://img.shields.io/github/license/edreanernst/node-red-contrib-opsgenie.svg)
[![Downloads](https://img.shields.io/npm/dm/node-red-contrib-opsgenie.svg)](https://www.npmjs.com/package/node-red-contrib-opsgenie)
[![NPM](https://img.shields.io/npm/v/node-red-contrib-opsgenie?logo=npm)](https://www.npmjs.org/package/node-red-contrib-opsgenie)
[![Known Vulnerabilities](https://snyk.io/test/npm/node-red-contrib-opsgenie/badge.svg)](https://snyk.io/test/npm/node-red-contrib-opsgenie)


These node-red nodes are used to work with [Opsgenie](https://www.opsgenie.com) using the REST API.

NOTE: This is a work in progress and currently only implements a very limited part of the Opsgenie Alert API functionality. The intention is to extend this project to cover all API functionality using a separate node for read and write for each API (eg. Alert API Write, Incident API Read, etc.)

Please feel free to contribute code by submitting pull requests. 

Alternatively, submit an issue on the [GitHub project page](https://github.com/edreanernst/node-red-contrib-opsgenie) and I will be more than willing to code the additional functionality myself according to the needs out there.

## Table of Contents
- [Opsgenie nodes Node-RED](#opsgenie-nodes-node-red)
  - [Table of Contents](#table-of-contents)
  - [Credits](#credits)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Properties](#properties)
  - [Usage](#usage)
    - [Alert Action](#alert-action)
      - [msg.action](#msgaction)
      - [msg.payload](#msgpayload)
      - [msg.identifier](#msgidentifier)
      - [msg.identifierType](#msgidentifiertype)
    - [Alert Read](#alert-reader)
      - [msg.action](#readmsgaction)
  - [Examples](#examples)
    - [Create a simple alert](#create-a-simple-alert)
    - [Create an alert with an alias and source](#create-an-alert-with-an-alias-and-source)
    - [Close an alert using alias as reference and adding a note](#close-an-alert-using-alias-as-reference-and-adding-a-note)

## Credits
[![Edrean Ernst (Creator)](https://avatars.githubusercontent.com/u/8310460?s=88 "Edrean Ernst (Creator)")](https://github.com/edreanernst)
[![Pedro Torrezão (Contributor)](https://avatars.githubusercontent.com/u/12836574?s=88 "Pedro Torrezão (Contributor)")](https://github.com/ptorrezao)

## Dependencies
This node depends on the following libraries :
* https (https://www.npmjs.com/package/https)

## Installation
This package can be installed through the Palette Manager in node-red.

It can also be installed by running the following command in your node-red directory (usually ~/.node-red) :
```
npm install node-red-contrib-opsgenie
```

## Properties
The nodes have the following properties :
* Parameters
  * This points to a configuration node that contains the information needed to connect to the Opsgenie API.
* Name
  * The chosen name for the node.

The configuration node has the following properties:
* API Host
  * This defines the API host that should be used. Default is 'api.opsgenie.com'.
* Version
  * The API version. The default is 'v2'.
* API Key
  * This is the API key created in your Opsgenie account. Refer to the Opsgenie documentation on how to create an API key.

## Usage
### Alert Action
This node will accept the following fields as input:
#### msg.action
This is a string field where an action can be specified that should be performed on alerts.

Accepted action strings are :
* "create" - This will create a new alert according to the parameters defined in <code>msg.payload</code>
* "close" - This will close an existing alert using <code>msg.identifier</code> and <code>msg.identifierType</code> as reference

#### msg.payload
This field is a JSON record defining the parameters that will be sent as the REST API body. The parameters will differ depending on the action being performed. Refer to the Opsgenie API documentation for more information.

As an example, if you want to create a new alert with an alias the payload will be :
```
"payload": {
    "message": "Alert world!",
    "alias": "myalertalias"
}
```

#### msg.identifier
This field is required when closing an alert. It is a string field that should contain the identifier used to identify the relevant alert that should be closed.

#### msg.identifierType
This field is also required when closing an alert. It is a string field that should contain the type of identifier used in <code>msg.identifier</code>. Possible values are:
* "id"
* "tiny"
* "alias"

Please refer to the Opsgenie API documentation for descriptions of each of these identifier types.

### Alert Read

This node will pull the existing alerts from your Opsgenie setup according the configuration.

#### Read msg.action
This is a string field where the type of action can be specified (e.g. list)
Possible values are:
* "list"
  * When triggered, this action will retrieve a list of the alerts from the [Alerts API Endpoint](https://docs.opsgenie.com/docs/alert-api#list-alerts) producing one message per alert.

## Examples

### Create a simple alert
```
"msg": {
    "action": "create",
    "payload": {
        "message": "Simple alert message"
    }
}
```

### Create an alert with an alias and source
```
"msg": {
    "action": "create",
    "payload": {
        "message": "Red alert!",
        "source": "noderedflow",
        "alias": "redalert"
    }
}
```

### Close an alert using alias as reference and adding a note
```
"msg": {
    "action": "close",
    "identifier": "redalert",
    "identifierType": "alias",
    "payload": {
        "note": "Node was here!"
    }
}
```

### Get current alerts
```
"msg": {
    "action": "list"
}
```
#### Example of a message produced per alert:
```
"msg": {
  "event_type": "Opsgenie Alert",
  "topic": "Opsgenie Alert",
  "payload": element.message,
  "data": 
  {
    "id": "70413a06-38d6-4c85-92b8-5ebc900d42e2",
    "tinyId": "1791",
    "alias": "event_573",
    "message": "Our servers are in danger",
    "status": "closed",
    "acknowledged": false,
    "isSeen": true,
    "tags": [ "OverwriteQuietHours", "Critical" ],
    "snoozed": true,
    "snoozedUntil": "2017-04-03T20:32:35.143Z",
    "count": 79,
    "lastOccurredAt": "2017-04-03T20:05:50.894Z",
    "createdAt": "2017-03-21T20:32:52.353Z",
    "updatedAt": "2017-04-03T20:32:57.301Z",
    "source": "Isengard",
    "owner": "morpheus@opsgenie.com",
    "priority": "P4",
    "responders":[ 
      { "id":"4513b7ea-3b91-438f-b7e4-e3e54af9147c", "type":"team" },
      { "id":"bb4d9938-c3c2-455d-aaab-727aa701c0d8", "type":"user" },
      { "id":"aee8a0de-c80f-4515-a232-501c0bc9d715", "type":"escalation" }, 
      { "id":"80564037-1984-4f38-b98e-8a1f662df552", "type":"schedule" }
    ],
    "integration": { 
        "id": "4513b7ea-3b91-438f-b7e4-e3e54af9147c",
        "name": "Nebuchadnezzar",
        "type": "API"
    },
    "report": {
        "ackTime": 15702,
        "closeTime": 60503,
        "acknowledgedBy": "agent_smith@opsgenie.com",
        "closedBy": "neo@opsgenie.com"
    }
  },
  {
    "id": "70413a06-38d6-4c85-92b8-5ebc900d42e2",
    "tinyId": "1791",
    "alias": "event_573",
    "message": "Sample Message",
    "status": "open",
    "acknowledged": false,
    "isSeen": false,
    "tags": [ "RandomTag" ],
    "snoozed": false,
    "count": 1,
    "lastOccurredAt": "2017-03-21T20:32:52.353Z",
    "createdAt": "2017-03-21T20:32:52.353Z",
    "updatedAt": "2017-04-03T20:32:57.301Z",
    "source": "Zion",
    "owner": "",
    "priority": "P5",
    "responders":[],
    "integration": {
        "id": "4513b7ea-3b91-b7e4-438f-e3e54af9147c",
        "name": "My_Lovely_Amazon",
        "type": "CloudWatch"
    }
  }
}
```
