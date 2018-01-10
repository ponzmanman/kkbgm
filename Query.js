/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.fetchQuery = (req, res) => {
    if (req.body.qTerm === undefined) {
        // This is an error case, as "qTerm" is required.
        res.status(400).send('No message defined!');
    } else {
        const kkbox = require('@kkbox/kkbox-js-sdk');
        const Auth = kkbox.Auth;
        const Api = kkbox.Api;

        // Open API ID, Secret
        const auth = new Auth('<Open API ID>', '<Open API Secret>')
        auth.clientCredentialsFlow.fetchAccessToken().then(response => {
            const access_token = response.data.access_token
            const api = new Api(access_token);
            // open API Search and track only filter
            api.searchFetcher.setSearchCriteria(req.body.qTerm, 'track').fetchSearchResult().then(response => {
                res.status(200).send({
                    "result": response.data.tracks.data
                });
            })
        })

    }
};