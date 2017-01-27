let request = require('request');

let MattermostPost = function (data) {
    if(data){
        this.text = data.text;
        this.username = data.name;
        this.channel = data.channel;
        this.icon_url = data.icon;
    }
};

MattermostPost.prototype.send = function(hook_url) {
    console.log(this);
    request({
        url: hook_url,
        method: "POST",
        json: true,
        body: this,
        strictSSL: false,
        rejectUnhauthorized : false
    }, (error, response, body) => {
        if(error) console.log(error);
    });
};

module.exports = MattermostPost;