
# ipm package: coap-toolkit-temp

## Overview

A ClearBlade library for parsing and building CoAP packets.

This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)

## Setup

Import into a Code Service, then initialize:

```
var coap = CoAP();
```

## Usage

Install library and add 'CoAPLib' to your code services. See examples below in <a href="#CoAP">CoAP</a>

### Code Libraries

`CoAPLib` - CoAP Library for building and parsing CoAP messages

### Code Services

`ExampleBuildCoAP` - builds an example CoAP message
`ExampleParseCoAP` - parses an example CoAP message

## API

### Typedefs

<dl>
<dt><a href="#CoAP">CoAP</a></dt>
<dd></dd>
<dt><a href="#CoAPOptions">CoAPOptions</a></dt>
<dd></dd>
<dt><a href="#CoAPJSON">CoAPJSON</a></dt>
<dd></dd>
</dl>

<a name="CoAP"></a>

### CoAP
**Kind**: global typedef  

* [CoAP](#CoAP)
    * [.parse(CoAPMessage)](#CoAP.parse) ⇒ [<code>CoAPJSON</code>](#CoAPJSON)
    * [.build(CoAPJSON)](#CoAP.build) ⇒ <code>Array.&lt;number&gt;</code>

<a name="CoAP.parse"></a>

#### CoAP.parse(CoAPMessage) ⇒ [<code>CoAPJSON</code>](#CoAPJSON)
Parses a CoAP message

**Kind**: static method of [<code>CoAP</code>](#CoAP)  
**Returns**: [<code>CoAPJSON</code>](#CoAPJSON) - CoAPJSON - JSON representation of CoAP message  

| Param | Type | Description |
| --- | --- | --- |
| CoAPMessage | <code>Array.&lt;number&gt;</code> | CoAP message, array of one byte integers |

**Example**  
```js
// Make a CoAP object
var coap = CoAP();

// This is the packet we want to parse
var packet = [65,1,0,1,0,186,99,108,101,97,114,98,108,97,100,101,97,50];

// Parsing the packet returns an object like below
var parsed = coap.parse(packet);
log(parsed);
/*
{
  "CoAP Version": 1,
  "Request Type": "Confirmable",
  "Command": {
    "Code": "0.01",
    "Name": "GET",
    "Type": "Request"
  },
  "Message ID": "0001",
  "Token": "00",
  "Options": {
    "Uri-Path": "clearblade",
    "Accept": "application/json"
  }
}
```
<a name="CoAP.build"></a>

#### CoAP.build(CoAPJSON) ⇒ <code>Array.&lt;number&gt;</code>
Builds a CoAP message with the provided parameters

**Kind**: static method of [<code>CoAP</code>](#CoAP)  
**Returns**: <code>Array.&lt;number&gt;</code> - CoAPMessage - CoAP message, array of one byte integers  

| Param | Type | Description |
| --- | --- | --- |
| CoAPJSON | [<code>CoAPJSON</code>](#CoAPJSON) | JSON representation of a CoAP message |

**Example**  
```js
var options = {
  	"Request Type": "Confirmable",
  	"Command": "POST",
  	"Message ID": 24,
  	"Token": 1,
  	"Options": {
  		"Uri-Path": "clearblade_rgb",
  		"Content-Format": "application/octet-stream",
  		"Payload": [0, 255, 112, 255, 0]
  	}
  };
  
  // Make a CoAP object
  var coap = CoAP();
  
  // Building a packet returns an array of integers
  var newPacket = coap.build(options);
  log(newPacket);
  resp.success(newPacket)
  // [65, 2, 0, 24, 1, 189, 1, 99, 108, 101, 97, 114, 98, 108, 97, 100, 101, 95, 114, 103, 98, 17, 42, 255, 0, 255, 112, 255, 0]
```
<a name="CoAPOptions"></a>

### CoAPOptions
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| If-Match | <code>Array.&lt;number&gt;</code> | integer array representing the raw hex bytes. |
| Uri-Host | <code>string</code> | Max of 255 characters. |
| ETag | <code>Array.&lt;number&gt;</code> | integer array representing the raw hex bytes |
| If-None-Match | <code>Array.&lt;number&gt;</code> | request conditional on the nonexistence of the target resource, ex [] |
| Uri-Port | <code>number</code> | transport-layer port number of the resource |
| Location-Path | <code>string</code> | Location-Path and Location-Query Options together indicate a relative URI that consists either of an absolute path, a query string, or both. max of 255 characters |
| Uri-Path | <code>string</code> | segment of the absolute path to the resource. Max of 255 characters. |
| Content-Format | <code>string</code> | enumeration of "text/plain", "application/link-format", "application/xml", "application/octet-stream", "application/exi", "application/json". ex "application/json" |
| Max-Age | <code>number</code> | maximum time a response may be cached before it is considered not fresh |
| Uri-Query | <code>string</code> | specifies one argument parameterizing the resource. Max of 255 characters. |
| Accept | <code>string</code> | same options as Content-Format. |
| Location-Query | <code>string</code> | specifies one argument parameterizing the resource. Max of 255 characters. |
| Proxy-Uri | <code>string</code> | used to make a request to a forward-proxy. Max of 1034 characters. |
| Proxy-Scheme | <code>string</code> | "http", "https". Max of 255 characters. |
| Size1 | <code>number</code> | size information, number of bytes, about the resource representation in a request |

<a name="CoAPJSON"></a>

### CoAPJSON
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Request Type | <code>string</code> | - enum of "Confirmable", "Non-confirmable", "Acknowledgement", or "Reset". ex. "Confirmable" |
| Command | <code>string</code> \| <code>Object</code> | either the code or name of the request/response, ex. "POST" |
| Message ID | <code>string</code> | - the hex string representation of the message ID, ex 24 |
| Token | <code>string</code> | the hex string representation of the token, ex 1 |
| CoAPOptions | [<code>CoAPOptions</code>](#CoAPOptions) | option names and their associated values |


## Thank you

Powered by ClearBlade Enterprise IoT Platform: [https://platform.clearblade.com](https://platform.clearblade.com)
