var querystring = require('querystring');
var http = require('http');
var url = require('url');
var fs = require('fs');

var myutil = {};

const output        = fs.createWriteStream('./logs/main.log', {flags: 'a'});
const errorOutput   = fs.createWriteStream('./logs/main.log', {flags: 'a'});
const logger        = new console.Console(output, errorOutput);

function __log(levelstr, args)
{
    var logid = 88888;
    var prelog = levelstr + ' [' + (new Date()).toString() + '] [' + logid + ']: ';
    args[0] = prelog + args[0];
    logger.log.apply(this, args);
}

myutil.log = function(){
    __log("TRACE", arguments);
};

myutil.error = function(){
    try {
        throw new Error();
    } catch (e) {
        var loc= e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
        __log("FATAL [" + loc + "]", arguments);
    }
};

myutil.notice = function(){
    __log("NOTICE", arguments);
};

myutil.getCmdStr = function (cmdname)
{
    var file = cmdname + ".cmd";
    var content = fs.readFileSync(file, 'utf-8');
    return content;
};

myutil.getJsonObj = function (filename)
{
    var file = filename;
    var content = fs.readFileSync(file);
    var result = JSON.parse(content);
    return result;
};


myutil.clone = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(JSON){
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};

myutil.exit = function(exit_no, exit_string){
    exit_no = exit_no ? exit_no : -1;
    myutil.error("process exit for [" + exit_no + "," + exit_string + "]");
    process.exit(exit_no);
};

module.exports = myutil;
