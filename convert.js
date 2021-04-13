var fs = require('fs'); 
var sarif_template =
{
    "version": "2.1.0",
    "runs": [
        {
            "originalUriBaseIds": {
                "PROJECTROOT": {
                    "uri": __dirname,
                    "description": {
                        "text": "The root directory for all project files."
                    }
                }
            },
            "tool": {
                "driver": {
                    "name": "Kubelinter",
                    "rules": []
                }
            },
            "results": []
        }
    ]
};


var args = process.argv.splice(2);
if (args.length < 1) {
    console.log("You must pass kubelinter json file");
    console.log("Usage:", process.argv[0], " input-file optional-output-file(default == output.sarif)");
    process.exit(0);
} 
var outputFile = "output.sarif";
if (args.length > 1) {
    outputFile = args[1]
    console.log("outputFile set to:", outputFile);
}

//set or get rules
function srules(sarif, optional_set) {
    if (optional_set) { sarif.runs[0].tool.driver.rules = optional_set }
    return sarif.runs[0].tool.driver.rules
}
function sresults(sarif, optional_set) {
    if (optional_set) { sarif.runs[0].results = optional_set }
    return sarif.runs[0].results
}

var id = 0; 
function new_rule(existingRules, kfinding) {
    var exists = existingRules[kfinding.rule]
    if (exists) return exists; 
    var r = {} 
    r.id = Object.keys (existingRules).length; 
    kfinding.id = r.id; // link back to single id
    r.shortDescription = { "text": kfinding.rule };
    r.fullDescription = { "text": kfinding.details };
    r.help = { "text": "text for help", "markdown": "markdown ***text for help" };
    r.defaultConfiguration = { "level": "error" };
    r.properties = { "tags": [] }
    existingRules[kfinding.rule] = r;
    return r;
}

function new_result(kfinding) {
    r = {}
    r.ruleId = kfinding.id;
    r.message = {
        "text": kfinding.details
    }
    r.locations = [{
        "physicalLocation": {
            "artifactLocation": {
                "uri": kfinding.filename,
                "uriBaseId": "PROJECTROOT"
            },
            "region": {
                "startLine": 1
            }
        }
    }];
    return r;
}


function writeJSON(file, value, then) {
    var stream = fs.createWriteStream(file);
    stream.once('open', function (fd) {
        stream.write(JSON.stringify(value));
        stream.end();
        console.log("Created: ", file);
        then(0)
    });
}
 
function parseErrorLine(e) {  
    var r = {}  
    var idx = e.indexOf(':');
    r.filename =  'deploy' + e.substr(4, idx-4 );   // skip hardcoded /dir/ and prefix with deploy
    e = e.substr(idx, e.length)

    idx = e.indexOf('(check:');
    r.msg = e.substr(1, idx-1 ).trim();
    r.details = e.substr(idx, e.length ).trim();

    var idx1 = r.details.indexOf(':');
    var idx2 = r.details.indexOf(',');
    r.rule = r.details.substr(idx1+1, idx2-idx1-1 ).trim();  
    return r;
}

function createSarif (d1) {
    var lines = d1.split(/\r\n|\n/);
    lines = lines.filter (function (e) { return e.length != 0 &&  e[0] == '/' })
   
    var results = [] 
    var existing = {} 
    lines.forEach (function (e) {
        var r = parseErrorLine (e)   
        new_rule(existing, r);   
        results.push (new_result(r)) 
    });  
    var newRules = Object.keys(existing).map (function (e) { return existing[e]}); 
    srules(sarif_template, newRules); 
    sresults(sarif_template, results)
    console.log(outputFile + " rules found: ", srules(sarif_template).length)
    console.log(outputFile + " locations found: ", sresults(sarif_template).length)
    return sarif_template;
}
 
    fs.readFile('klint.txt', 'utf8', function (err, klintData) {
        var sarif = createSarif (klintData)
        writeJSON(outputFile, sarif, process.exit)
    }) 
