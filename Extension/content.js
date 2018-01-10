const KKBGM = new function () {
    this.getKeywords = function (url) {
        // post to newsExtractor GCP function for keywords
        $.ajax({
            type: 'POST',
            url: 'https://us-central1-kknews-191204.cloudfunctions.net/newsExtractor',
            data: '{"url":"' + url + '"}',
            contentType: "application/json",
            dataType: 'json',
            success: function (keywords) {
                if (keywords) {
                    KKBGM.getTracks(keywords);
                }
            }
        });
    }
    this.getTracks = function (result) {
        if (result.keywords !== '') {
            // post to open api GCP function for tracks
            $.ajax({
                type: 'POST',
                url: 'https://us-central1-kknews-191204.cloudfunctions.net/Query',
                data: '{"qTerm":"' + result.keywords + '"}',
                contentType: "application/json",
                dataType: 'json',
                success: function (tracks) {
                    KKBGM.appendWidget(tracks);
                }
            });
        }
    }
    this.appendWidget = function (tracks) {
        // take partial data
        tracks = tracks.result.slice(0, 3);
        tracks.forEach(track => {
            const url = 'https://widget.kkbox.com/v1/?id=' + track.id + '&type=song&terr=TW&lang=ZH#'
            const elements = '<iframe src=\'' + url + '\' width=\'300px\' height=\'100px\'></iframe>';
            $("#mrt-node-Col2-3-Headlines").prepend(elements);
        });
    }
}


$(document).ready(function () {
    console.log("KKBGM Loaded.")
    var currentLocation = window.location;
    KKBGM.getKeywords(currentLocation);
})