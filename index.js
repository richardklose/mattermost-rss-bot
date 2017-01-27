// rss feed configuration
let config = require('./config.json');
let Feed = require('./Feed');
let Feeds = [];
// create objects from feed entries
initializeFeeds(config.feeds)


for (let feed of Feeds) {
    feed.watch(config.interval, (post) => {
        post.send(config.mattermost_hook);
    });
}

function initializeFeeds(feedconf) {
    Feeds = [];
    for (let fd of feedconf) {
        Feeds.push(new Feed(fd.url, fd));
    }
}