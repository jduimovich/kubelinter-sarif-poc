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
    console.log("You must pass a kubelinter output file");
    console.log("Usage:", process.argv[0], " input-file optional-output-file(default == output.sarif)");
    process.exit(0);
} 
var inputFile = args[0];
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
function find_or_create_rule(existingRules, linter_line) {
    var exists = existingRules[linter_line.rule]
    if (exists) return exists; 
    var rule = {} 
    rule.id = Object.keys (existingRules).length; 
    linter_line.id = rule.id; // link back to single id
    rule.shortDescription = { "text": linter_line.rule };
    rule.fullDescription = { "text": linter_line.details };
    rule.help = { "text": "text for help", "markdown": "markdown ***text for help" };
    rule.defaultConfiguration = { "level": "error" };
    rule.properties = { "tags": [] }
    existingRules[linter_line.rule] = rule;
    return rule;
}

function new_result(linter_line) {
    result = {}
    result.ruleId = linter_line.id;
    result.message = {
        "text": linter_line.details
    }
    result.locations = [{
        "physicalLocation": {
            "artifactLocation": {
                "uri": linter_line.filename,
                "uriBaseId": "PROJECTROOT"
            },
            "region": {
                "startLine": 1
            }
        }
    }];
    return result;
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
    r.filename =  e.substr(4, idx-4 );   // skip hardcoded /dir/ and prefix with deploy
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
    lines = lines.filter (
        function (e) { return e.length != 0 && 
              e.indexOf('(check:') != -1 })
   
    var results = [] 
    var existing = {} 
    lines.forEach (function (e) {
        var r = parseErrorLine (e)   
        find_or_create_rule(existing, r);   
        results.push (new_result(r)) 
    });  
    var newRules = Object.keys(existing).map (function (e) { return existing[e]}); 
    srules(sarif_template, newRules); 
    sresults(sarif_template, results)
    console.log(outputFile + " rules found: ", srules(sarif_template).length)
    console.log(outputFile + " locations found: ", sresults(sarif_template).length)
    return sarif_template;
}
 
    fs.readFile(inputFile, 'utf8', function (err, klintData) {
        if (err) { 
            console.log ("No File ", inputFile)
        } else {  
            var sarif = createSarif (klintData)
            writeJSON(outputFile, sarif, process.exit)
        }
    }) 
