var fs = require('fs');

var generate = function (inputBaseDir, outputDir) {
    var files = fs.readdirSync(inputBaseDir);
    var i = 0;
    var message = "class PackagedJSON {\n" +
        "    static getFiles() {\n" +
        "        return new Map([['common', [";
    files.forEach(function (file) {
        if (file.indexOf(".json") >= 0 && file !== '.' && file !== '..') {
            message += "require('../../config/" + i++ + ".json'),";
        }
    });
    message += "]], ";
    message = message.replace("),]]", ")]]");

    files.forEach(function (file) {
        if (file.indexOf(".json") < 0 && file !== '.' && file !== '..') {
            var stateFiles = fs.readdirSync(inputBaseDir + "/" + file);
            var stateFileNumbers = stateFiles.map(function(stateFileName) {
                return Number(stateFileName.replace('.json', ''));
            });

            message += "['" + file + "', [";
            stateFileNumbers.sort(function(a, b) {return a - b;}).forEach(function (stateFileNumber) {
                message += "require('../../config/" + file + "/" + stateFileNumber + ".json'),";
            });
            message += "]],";
            message = message.replace("),]]", ")]]");
        }
    });

    message += "]);";

    message += "}\n" +
        "}\n" +
        "\n" +
        "export default PackagedJSON;";

    message = message.replace(")]],]);}", ")]]]);}");

    let outputFilePath = outputDir + '/PackagedJSON.js';
    fs.writeFileSync(outputFilePath, message);
    console.log(`Written output file: ${outputFilePath}`);
};

generate('../reference-data/nhsrc/output/recorded-response/jsons/6', '../reference-data/nhsrc/output/recorded-response');