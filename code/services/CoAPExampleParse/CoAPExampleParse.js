
/**
 * parses an example CoAP message
 */
function CoAPExampleParse(req, resp){
    // Make a CoAP object
    var coap = CoAP();
    
    // This is the packet we want to parse
    var packet = [65,1,0,1,0,186,99,108,101,97,114,98,108,97,100,101,97,50];
    
    // Parsing the packet returns an object like below
    var parsed = coap.parse(packet);
    resp.success(parsed);
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
    */
}