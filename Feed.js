let FeedParser = require('feedparser');
let request = require('request');

let FeedItem = require('./FeedItem');

let Feed = function(url, config ) {
    this.url = url;
    if (config) {
        if(config.icon)    { this.icon = config.icon; }
        if(config.name)    { this.name = config.name; }
        if(config.channel) { this.channel = config.channel; }
        if(config.template){ this.template = config.template; }
    }
};

Feed.prototype.getNew = function(callback) {
    let req = request(this.url);
    let feedparser = new FeedParser();

    req.on('error', (error) => {
        console.log('Could not get feed: ' + this.url);
        console.log(error);
    });

    req.on('response',(res) => {
        if (res.statusCode !== 200) {
            req.emit('error', new Error('Bad status code'));
        }
        else {
            req.pipe(feedparser);
        }
    });

    feedparser.on('error', (error) => {
        console.log('Could not parse feed: ' + this.url);
        console.log(error);
    });
    this.items = [];
    feedparser.on('readable', () => {
        this.meta = feedparser.meta;
        let item;
        while (item = feedparser.read()) {
            this.items.push(new FeedItem(item, this.template));
        }
    });

    feedparser.on('end', () => {
        //sort items by date
        this.items.sort((a,b) => {
           return  a.date - b.date;
        });

        if (this.last_refresh) {
            // check which items are new since last refresh and output them all
            for (let item of this.items) {
                if(item.date > this.last_refresh) {
                    callback(item);
                }
            }
        } else {
            // feed has never been loaded before, only output newest item
            let last = this.items[this.items.length-1];
            this.last_refresh = last.date;
            callback(last);
        }
    })
};

Feed.prototype.watch = function(interval, callback) {

    let get = () => {
        this.getNew((item) => {
            let post = item.toMattermostPost();
            post.channel = this.channel;
            post.icon_url = this.icon;
            post.username = this.name;
            callback(post);
        });
    };

    console.log("watching " + this.url);
    get();
    setInterval(get, parseInt(interval));
};


module.exports = Feed;