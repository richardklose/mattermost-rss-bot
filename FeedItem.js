let MattermostPost = require('./MattermostPost');

let FeedItem = function(data, template) {
    if (data) {
        this.title = data.title;
        this.description = data.description;
        this.summary = data.summary;
        this.link = data.link;
        this.date = Date.parse(data.date);
        this.pubdate = Date.parse(data.pubdate);
        this.author = data.author;
        this.comments = data.comments;
        this.image = data.image;
        this.categories = data.categories;
    }
    if(template) { this.template = template } else { this.template = "" }
};

FeedItem.prototype.toMattermostPost = function() {
    let post = new MattermostPost();
    post.text = this.template
        .replace('{{link}}', this.link)
        .replace('{{title}}', this.title);
    return post;
};

module.exports = FeedItem;