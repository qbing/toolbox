var myutil  = require('./myutil.js');
var exec    = require('child_process').exec; 

function execDidi(cmdname){
    var cmdStr  = myutil.getCmdStr(cmdname); 
    console.log(cmdStr);
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            console.log('执行命令失败:'+stderr);
        } else {
            //console.log(stdout);
            var history = JSON.parse(stdout);
            //console.log(history);

            if (history && history.errno == 0){
                exportHistory(history.order_done);
            }else{
                console.log("请求数据失败, 错误码不为零或者数据为空");
            }
        }
    });
}

function exportHistory(orders){
    var xls = [];
    orders.forEach(function(item,index){ 
        if (item.status == 5){
            return;
        }
        var row = [];
        row.push("交通费");
        row.push("出行补贴");
        row.push("");
        switch(item.product_name){
            case '顺风车':
                row.push("无-" + item.product_name);
                break;
            case '快车':
                row.push("有-电子票-" + item.product_name);
                break;
            case '出租车':
                row.push("有-" + item.product_name);
                break;
            default:
                row.push("无-其他-" + item.product_name);
                break;
        }
        row.push(item.setuptime);
        row.push(index);
        row.push(item.hisstatus);
        row.push(item.status);
        row.push(item.substatus);
        row.push(item.fromAddress);
        row.push(item.toAddress);
        xls.push(row);
        var str = row.join(',');
        console.log(str);
    });

}



execDidi('gethistory-20171228-1');
execDidi('gethistory-20171228-2');
execDidi('gethistory-20171228-3');
