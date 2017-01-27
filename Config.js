let Config = {
    config: require('./config.json')
};

let fs = require('fs');

Config.update = function(modify_callback){
    modify_callback(this.config);
    fs.writeFile('./config.json', JSON.stringify(this.config, null, 2), 'utf8', (err) => {
        if(err) console.log(err);
    });
}

module.exports = Config;