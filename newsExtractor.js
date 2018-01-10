/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.extractKeyword = (req, res) => {
    if (req.body.url === undefined) {
        // This is an error case, as "url" is required.
        res.status(400).send('No message defined!');
    } else {
        const request = require('request');
        const cheerio = require('cheerio')
        const nodejieba = require("nodejieba");

        const reqURL = req.body.url;
        request(reqURL, function (error, response, body) {
            const $ = cheerio.load(body);

            // concat news content with paragraph
            // [TODO] refactor news content aggregation
            // [TODO] ignore ad. and related news links
            let innerText = $(".canvas-header").text();
            innerText = innerText + $("article p").eq(0).text();
            innerText = innerText + $("article p").eq(1).text();
            innerText = innerText + $("article p").eq(2).text();
            innerText = innerText + $("article p").eq(3).text();

            // [TODO] load distinct artists/Track as Dict
            const extractResult = nodejieba.extract(innerText, 10);
            const keywords = [];
            for (const index in extractResult) {
                const keyword = extractResult[index];
                keywords.push(keyword.word);
            }

            res.status(200).send({
                "keywords": keywords.toString()
            });
        });
    }
};