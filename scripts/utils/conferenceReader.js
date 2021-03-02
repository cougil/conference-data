const fs = require('fs');
const assert = require('assert');
const topics = require('../../config/topics');

const jsonFileRegex = /(.*).json$/;

module.exports = function conferenceReader() {
    const conferencesJSON = {};

    fs.readdirSync('conferences').forEach(year => {
        conferencesJSON[year] = {};
        fs.readdirSync(`conferences/${year}`).forEach(fileName => {
            const filePath = `conferences/${year}/${fileName}`;
            assert(jsonFileRegex.test(fileName));
            const topic = jsonFileRegex.exec(fileName)[1];
            assert(topics.indexOf(topic) != -1, `Topic "${topic} is not in topic list. File: ${filePath}`);
            const fileContent = fs.readFileSync(filePath);
            if (fileContent.toString() === '[]') {
                return;
            }
            try {
                conferencesJSON[year][topic] = JSON.parse(fileContent);
            } catch (exception) {
                assert.fail(`Unable to read file: "${filePath}". Error: ${exception}`);
            }
        });
    });

    return conferencesJSON;
};
