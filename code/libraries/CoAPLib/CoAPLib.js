
/******************************************************************************
 * 
    _______      ,-----.       ____    .-------.           .---.    .-./`)  _______    
   /   __  \   .'  .-,  '.   .'  __ `. \  _(`)_ \          | ,_|    \ .-.')\  ____  \  
  | ,_/  \__) / ,-.|  \ _ \ /   '  \  \| (_ o._)|        ,-./  )    / `-' \| |    \ |  
,-./  )      ;  \  '_ /  | :|___|  /  ||  (_,_) /        \  '_ '`)   `-'`"`| |____/ /  
\  '_ '`)    |  _`,/ \ _/  |   _.-`   ||   '-.-'          > (_)  )   .---. |   _ _ '.  
 > (_)  )  __: (  '\_/ \   ;.'   _    ||   |             (  .  .-'   |   | |  ( ' )  \ 
(  .  .-'_/  )\ `"/  \  ) / |  _( )_  ||   |              `-'`-'|___ |   | | (_{;}_) | 
 `-'`-'     /  '. \_/``".'  \ (_ o _) //   )               |        \|   | |  (_,_)  / 
   `._____.'     '-----'     '.(_,_).' `---'               `--------`'---' /_______.'  
                                                                                       
                                                                                       
 ******************************************************************************/

/**
 * @typedef CoAP
 * 
 * CoAP Library for parsing and building CoAP messages
 */
function CoAP(){

    // PARSING HELPER FUNCTIONS

    function intArrToHexString(arr){
        return (arr.map(function(x){var y=x.toString(16);return x<16?'0'+y:y})).join('');
    }

    function intArrToAsciiString(arr){
        return arr.map(function(x){return String.fromCharCode(x)}).join("");
    }

    function intArrToInt(arr){
        return parseInt(intArrToHexString(arr),16);
    }
    
    function splitByte(toSplit){
        var byte = toSplit;
        var ret = [];
        ret = ret.concat((byte&0xF0)>>4);
        ret = ret.concat(byte&0x0F);
        return ret;
    }

    function splitHalfByte(toSplit){
        var halfByte = toSplit;
        var ret = [];
        ret = ret.concat((halfByte&0xC)>>2);
        ret = ret.concat(halfByte&0x3);
        return ret;
    }
    
    function mapRequest(reqType){
        switch(reqType){
            case 0:
                return "Confirmable";
            case 1:
                return "Non-confirmable";
            case 2:
                return "Acknowledgement";
            case 3:
                return "Reset";
            default: 
                return "Invalid request type";
        }
    }

    function mapFormat(formatNum){
        switch(formatNum){
            case 0:
                return "text/plain;charset=utf-8";
            case 40:
                return "application/link-format";
            case 41:
                return "application/xml";
            case 42:
                return "application/octet-stream";
            case 47:
                return "application/exi";
            case 50:
                return "application/json";
            default:
                return "invalid format";
        }
    }
    
    function mapCommand(command){
        var ret = [];
        if(command<32){
            ret = ret.concat(["Request"]);
        }else{
            ret = ret.concat(["Response"]);
        }
        switch(command){
            case 0:
                return ret.concat(["0.00", "Empty message"]); 
            case 1:
                return ret.concat(["0.01", "GET"]);
            case 2:
                return ret.concat(["0.02", "POST"]);
            case 3:
                return ret.concat(["0.03", "PUT"]);
            case 4:
                return ret.concat(["0.04", "DELETE"]);
        }
        return ["Invalid command", null, null];
    }
    
    function mapOptions(optionNum, optionVal){
        var ret = ["invalid option", optionVal];
        switch(optionNum){
            case 1:
                ret[0] = "If-Match";
                // ret[1] is opaque
                break;
            case 3:
                ret[0] = "Uri-Host";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 4:
                ret[0] = "ETag";
                // ret[1] is opaque
                break;
            case 5:
                ret[0] = "If-None-Match";
                // ret[1] is empty
                break;
            case 7:
                ret[0] = "Uri-Port";
                ret[1] = intArrToInt(ret[1]);
                break;
            case 8:
                ret[0] = "Location-Path";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 11:
                ret[0] = "Uri-Path";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 12:
                ret[0] = "Content-Format";
                ret[1] = mapFormat(intArrToInt(ret[1]));
                break;
            case 14:
                ret[0] = "Max-Age";
                ret[1] = intArrToInt(ret[1]);
                break;
            case 15:
                ret[0] = "Uri-Query";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 17:
                ret[0] = "Accept";
                ret[1] = mapFormat(intArrToInt(ret[1]));
                break;
            case 20:
                ret[0] = "Location-Query";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 35:
                ret[0] = "Proxy-Uri";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 39:
                ret[0] = "Proxy-Scheme";
                ret[1] = intArrToAsciiString(ret[1]);
                break;
            case 60:
                ret[0] = "Size1";
                ret[1] = intArrToInt(ret[1]);
                break;
            default:
                ret[1] = {
                    number: optionNum,
                    value: optionVal
                };
                break;
        }
        return ret;
    }

    // BUILDING HELPER FUNCTIONS
    
    function asciiToIntArr(str){
        return str.split("").map(function(c){return c.charCodeAt(0)});
    }

    function hexStringToIntArr(hex){
        var ret = hex.match(/.{2}/g).map(function(x){return parseInt(x,16)});
        if(!(typeof ret[0] != 'undefined' && ret[0])){
            ret.shift();
        }
        return ret;
    } 

    function intToIntArr(messageStr){
        var hex = parseInt(messageStr).toString(16);
        if(hex.length%2===1){
            hex = '0'+hex;
        }
        return hexStringToIntArr(hex);
    }

    function mapBackReqType(reqType){
        switch(reqType.replace(/[\- ]/g,"")){
            case "CONFIRMABLE":
                return 0;
            case "NONCONFIRMABLE":
                return 1;
            case "ACKNOWLEDGEMENT":
                return 2;
            case "RESET":
                return 3;
            default: 
                return -1;
        }
    }

    function mapBackCommand(command){
        switch(command){
            case "0.00":
            case "EMPTY":
            case "EMPTY MESSAGE":
                return 0;
            case "0.01":
            case "GET":
                return 1;
            case "0.02":
            case "POST":
                return 2;
            case "0.03":
            case "PUT":
                return 1;
            case "0.04":
            case "DELETE":
                return 2;
        }
    }

    function mapBackOption(option){
        var op = option.replace(/[\- ]/g,"").toUpperCase();
        switch(op){
            case "IFMATCH":
                return 1;
            case "URIHOST":
                return 3;
            case "ETAG":
                return 4;
            case "IFNONEMATCH":
                return 5;
            case "URIPORT":
                return 7;
            case "LOCATIONPATH":
                return 8;
            case "URIPATH":
                return 11;
            case "CONTENTFORMAT":
                return 12;
            case "MAXAGE":
                return 14;
            case "URIQUERY":
                return 15;
            case "ACCEPT":
                return 17;
            case "LOCATIONQUERY":
                return 20;
            case "PROXYURI":
                return 35;
            case "PROXYSCHEME":
                return 39;
            case "SIZE1":
                return 60;
            case "PAYLOAD": 
                return -2;
            default:
                return -1;
        }
    }

    function getOptionDeltas(options){
        var nums = [];
        for(var option in options){
            var num = mapBackOption(option);
            nums.push({
                original: num,
                delta: num,
                value: options[option]
            });
        }
        nums.sort(function(a,b){
            return parseInt(a.original) - parseInt(b.original);
        })
        if(nums[0].original===-2){
            nums.push(nums[0]);
            nums.shift();
        }
        for(var i=0;i<nums.length-1;i++){
            if(nums[i+1].original!==-2){
                nums[i+1].delta -= nums[i].original;
            }else{
                nums[i+1].delta = -2;
            }
        }
        return nums;
    }

    function mapBackFormat(format){
        switch(format.replace(/[;\-=/]/g,"").toUpperCase()){
            case "TEXTPLAINCHARSETUTF8":
            case "TEXTPLAIN":
                return 0;
            case "APPLICATIONLINKFORMAT":
                return 40;
            case "APPLICATIONXML":
                return 41;
            case "APPLICATIONOCTETSTREAM":
                return 42;
            case "APPLICATIONEXI":
                return 47;
            case "APPLICATIONJSON":
                return 50;
            default:
                return -1;
        }
    }

    function convertOptionValues(optionNum, optionVal){
        switch(optionNum){
            case 1:
                return optionVal;
            case 3:
                return asciiToIntArr(optionVal);
            case 4:
                return optionVal;
            case 5:
                return optionVal;
            case 7:
                return optionVal;
            case 8:
                return asciiToIntArr(optionVal);
            case 11:
                return asciiToIntArr(optionVal);
            case 12:
                return mapBackFormat(optionVal);
            case 14:
                return optionVal;
            case 15:
                return asciiToIntArr(optionVal);
            case 17:
                return mapBackFormat(optionVal);
            case 20:
                return asciiToIntArr(optionVal);
            case 35:
                return asciiToIntArr(optionVal);
            case 39:
                return asciiToIntArr(optionVal);
            case 60:
                return optionVal;
            case -2:
                return optionVal;
            default:
                return optionVal;
        }
    }

    function buildOptionsBuf(ops){
        var options = getOptionDeltas(ops);
        var optionsBuf = [];
        for(var i in options){
            var option = options[i];
            var delta = option.delta;
            var excessDelta = [];
            var excessLength = [];
            
            if(delta===-2){
                delta = 0xFF; // payload
            }else if(delta<13){
                delta = delta<<4;
            }else if(delta<269){
                excessDelta.push(delta-13);
                delta = 13<<4;
            }else{
                excessDelta.push((delta-269)>>8);
                excessDelta.push((delta-269)&0xFF);
                delta = 14<<4;
            }
            var value = convertOptionValues(option.original, option.value);
            if(value.constructor === Array){
                if(delta===0xFF){
                    optionsBuf.push(delta);
                }else if(value.length<13){
                    optionsBuf.push(delta|value.length);
                }else if(value.length<269){
                    optionsBuf.push(delta|13)
                    excessLength.push(value.length-13);
                }else{
                    optionsBuf.push(delta|14);
                    excessLength.push((value.length-269)>>8);
                    excessLength.push((value.length-269)&0xFF);
                }
            }else{
                optionsBuf.push(delta|1);
            }
            optionsBuf = optionsBuf.concat(excessDelta).concat(excessLength).concat(value);
        }
        return optionsBuf;
    }

    // ACCESSIBLE FUNCTIONS
    
    /**
     * Parses a CoAP message
     *
     * @memberof CoAP
     * @alias parse
     * @param {number[]} CoAPMessage - CoAP message, array of one byte integers
     * @returns {CoAPJSON} CoAPJSON - JSON representation of CoAP message
     * @example
     * 
     * // Make a CoAP object
     * var coap = CoAP();
     * 
     * // This is the packet we want to parse
     * var packet = [65,1,0,1,0,186,99,108,101,97,114,98,108,97,100,101,97,50];
     * 
     * // Parsing the packet returns an object like below
     * var parsed = coap.parse(packet);
     * log(parsed);
     * /*
     * {
     *   "CoAP Version": 1,
     *   "Request Type": "Confirmable",
     *   "Command": {
     *     "Code": "0.01",
     *     "Name": "GET",
     *     "Type": "Request"
     *   },
     *   "Message ID": "0001",
     *   "Token": "00",
     *   "Options": {
     *     "Uri-Path": "clearblade",
     *     "Accept": "application/json"
     *   }
     * }
     */
    function parseCoAP(buffer){
        if(buffer.constructor !== Array){
            return "Invalid packet. Expected array."
        }
        var buf = buffer.slice();
        var packet = {}
        var firstByte = splitByte(buf.shift());
        var firstHalfByte = splitHalfByte(firstByte[0]);
        packet["CoAP Version"] = firstHalfByte[0];
        packet["Request Type"] = mapRequest(firstHalfByte[1]);
        var tokenLength = firstByte[1];
        var command = mapCommand(buf.shift());
        packet["Command"] = {
            Type: command[0],
            Code: command[1],
            Name: command[2]
        };
        packet["Message ID"] = intArrToHexString([].concat(buf.splice(0,2))).toUpperCase();
        packet["Token"] = intArrToHexString([].concat(buf.splice(0,tokenLength))).toUpperCase();
        var options = {};
        var prevOptions = 0;
        while(buf.length>0){
            var option = buf.shift();
            var optionSplit = splitByte(option);
            var delta;
            var len = optionSplit[1];
            if(option===0xFF){
                options.Payload = buf.slice();
                buf = [];
            }else{
                switch(optionSplit[0]){
                    case 0xF:
                        if(optionSplit[1]!==0xF){
                            return{
                                "Error": "Message format error",
                                "Details": "Encountered an option delta of 15 and it's not the payload marker"
                            };
                        }
                        break;
                    case 0xE:
                        delta = parseInt(intArrToHexString([].concat(buf.splice(0,2))),16)+269;
                        break;
                    case 0xD:
                        delta = buf.shift()+13;
                        break;
                    default:
                        delta = optionSplit[0];
                        break;
                }
                option = prevOptions+delta;
                prevOptions += delta;
                switch(len){
                    case 0xF:
                        return{
                            "Error": "Message format error",
                            "Details": "Encountered an option length of 15"
                        };
                    case 0xE:
                        len = parseInt(intArrToHexString([].concat(buf.splice(0,2))),16)+269;
                        break;
                    case 0xD:
                        len = buf.shift()+13;
                        break;
                    default:
                        break;
                }
                option = mapOptions(option, [].concat(buf.splice(0,len)));
                options[option[0]] = option[1];
            }
        }
        if(Object.keys(options).length){
            packet["Options"] = options;
        }
        return packet;
    }

    /**
     * Builds a CoAP message with the provided parameters
     *
     * @memberof CoAP
     * @alias build
     * @param {CoAPJSON} CoAPJSON - JSON representation of a CoAP message
     * @returns {number[]} CoAPMessage - CoAP message, array of one byte integers
     *
     * @example
     * 
     *    var options = {
     *   	"Request Type": "Confirmable",
     *   	"Command": "POST",
     *   	"Message ID": 24,
     *   	"Token": 1,
     *   	"Options": {
     *   		"Uri-Path": "clearblade_rgb",
     *   		"Content-Format": "application/octet-stream",
     *   		"Payload": [0, 255, 112, 255, 0]
     *   	}
     *   };
     *   
     *   // Make a CoAP object
     *   var coap = CoAP();
     *   
     *   // Building a packet returns an array of integers
     *   var newPacket = coap.build(options);
     *   log(newPacket);
     *   resp.success(newPacket)
     *   // [65, 2, 0, 24, 1, 189, 1, 99, 108, 101, 97, 114, 98, 108, 97, 100, 101, 95, 114, 103, 98, 17, 42, 255, 0, 255, 112, 255, 0]
     *
     */
    function buildCoAP(details){
        var reqType, command, messageID, token, options;
        for(var deet in details){
            switch(deet.replace(/[\-_ ]/g,"").toUpperCase()){
                case "REQUESTTYPE":
                    reqType = mapBackReqType(details[deet].toUpperCase());
                    break;
                case "COMMAND":
                    command = mapBackCommand(details[deet].toUpperCase());
                    break;
                case "MESSAGEID":
                    messageID = details[deet];
                    if(typeof parseInt(messageID) != 'undefined' && parseInt(messageID)){
                        messageID = intToIntArr(messageID);
                    }else{
                        messageID = hexStringToIntArr(messageID);
                    }
                    if(messageID.length>2){
                        return "Message ID is too large";
                    }
                    if(messageID.length<2){
                        messageID = [0].concat(messageID);
                    }
                    break;
                case "TOKEN":
                    token = details[deet];
                    if(typeof parseInt(token) != 'undefined' && parseInt(token)){
                        token = intToIntArr(token);
                    }else{
                        token = hexStringToIntArr(token);
                    }
                    if(token.length>8){
                        return "Token is too large";
                    }
                    break;
                case "OPTIONS":
                    options = buildOptionsBuf(details[deet]);
                    break;
            }
        }
        if(   !(typeof reqType!='undefined')
            ||!(typeof command!='undefined')
            ||!(typeof messageID!='undefined')
            ||!(typeof token!='undefined')
            ){
            return "Missing required parameter"
        }
        var firstByte = ((4 | reqType)<<4)|token.length;
        return [].concat(firstByte).concat(command).concat(messageID).concat(token).concat(options);
    }
    
    return {
        parse: parseCoAP,
        build: buildCoAP
    }
}    

/**
 * @typedef CoAPOptions
 * @property {number[]} If-Match - integer array representing the raw hex bytes.
 * @property {string} Uri-Host - Max of 255 characters.
 * @property {number[]} ETag - integer array representing the raw hex bytes
 * @property {number[]} If-None-Match - request conditional on the nonexistence of the target resource, ex []
 * @property {number} Uri-Port - transport-layer port number of the resource
 * @property {string} Location-Path - Location-Path and Location-Query Options together indicate a relative URI that consists either of an absolute path, a query string, or both. max of 255 characters
 * @property {string} Uri-Path - segment of the absolute path to the resource. Max of 255 characters.
 * @property {string} Content-Format - enumeration of "text/plain", "application/link-format", "application/xml", "application/octet-stream", "application/exi", "application/json". ex "application/json"  
 * @property {number} Max-Age - maximum time a response may be cached before it is considered not fresh
 * @property {string} Uri-Query - specifies one argument parameterizing the resource. Max of 255 characters.
 * @property {string} Accept - same options as Content-Format.
 * @property {string} Location-Query - specifies one argument parameterizing the resource. Max of 255 characters.
 * @property {string} Proxy-Uri - used to make a request to a forward-proxy. Max of 1034 characters.
 * @property {string} Proxy-Scheme - "http", "https". Max of 255 characters.
 * @property {number} Size1 - size information, number of bytes, about the resource representation in a request
 */

 /**
 * @typedef CoAPJSON
 *
 * @property {string} Request Type - enum of "Confirmable", "Non-confirmable", "Acknowledgement", or "Reset". ex. "Confirmable"
 * @property {string|Object} Command - either the code or name of the request/response, ex. "POST"
 * @property {string} Message ID - the hex string representation of the message ID, ex 24
 * @property {string} Token - the hex string representation of the token, ex 1
 * @property {CoAPOptions} CoAPOptions - option names and their associated values
 */
