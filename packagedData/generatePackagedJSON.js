const fs = require('fs');

const generate = function (inputBaseDir, outputDir) {
    console.log(`Reading recorded responses from ${inputBaseDir}`);
    const files = fs.readdirSync(inputBaseDir);
    let i = 0;
    let message = "class PackagedJSON {\n" +
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
            const stateFiles = fs.readdirSync(inputBaseDir + "/" + file);
            const stateFileNumbers = stateFiles.map(function (stateFileName) {
                return Number(stateFileName.replace('.json', ''));
            });

            message += "['" + file + "', [";
            stateFileNumbers.sort(function (a, b) {
                return a - b;
            }).forEach(function (stateFileNumber) {
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

    let outputFile = outputDir + '/PackagedJSON.js';
    console.log(`Creating ${outputFile}`);
    fs.writeFileSync(outputFile, message);
};

generate(`src/config`, 'src/js/service');
