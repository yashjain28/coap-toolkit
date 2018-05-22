function CoAPExampleBuild(req, resp){
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
    resp.success(newPacket)
    // [65, 2, 0, 24, 1, 189, 1, 99, 108, 101, 97, 114, 98, 108, 97, 100, 101, 95, 114, 103, 98, 17, 42, 255, 0, 255, 112, 255, 0]
}