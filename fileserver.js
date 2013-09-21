var settings = require("./settings") ; 
var http = require('http') ; 
var fs = require('fs') ; 
var Upload = function(){}
Upload.prototype.upload = function(filepath , filename , type , filetype , callback){
    var boundaryKey = '----' + new Date().getTime();
        var path = "" ;
        if(type == "uploadBookImg")
             path = settings.bookimgfolder ; 
        var buffers = [];
        var nread = 0;
        var options = {
            host:settings.filehost,//远端服务器域名
            port:settings.fileport,//远端服务器端口号
            method:'POST',
            path:"/upload",//上传服务路径,
            url : settings.filepostmethod , 
            headers:{
                'Content-Type':'multipart/form-data; boundary=' + boundaryKey,
                'Connection':'keep-alive'
            }
        };
        var req = http.request(options,function(res){
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('body: ' + chunk);
                buffers.push(chunk);
                nread += chunk.length;
            });
            res.on('end',function(){
                console.log('res end.');
                if(buffers.length >0)
                {
                    var result = JSON.parse('[' + buffers[0] + ']')[0] ; 
                    if(result.success)
                        callback(true) ; 
                    else
                        callback(false) ; 
                }
            });
        });
        req.write(
            '--' + boundaryKey + '\r\n' +
            'Content-Disposition: form-data; name="upload"; filename="'+path + filename+'"\r\n' +
            'Content-Type: '+filetype+'\r\n\r\n'
        );
        //设置1M的缓冲区
        var fileStream = fs.createReadStream( filepath ,{encoding: 'utf-8' ,bufferSize:1024 * 1024});
        fileStream.pipe(req,{end:false});
        fileStream.on('end',function(){
            req.end('\r\n--' + boundaryKey + '--');
            var buffer = null;
            switch(buffers.length) {
                case 0: buffer = new Buffer(0);
                    break;
                case 1: buffer = buffers[0];
                    break;
                default:
                    buffer = new Buffer(nread);
                    for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
                        var chunk = buffers[i];
                        chunk.copy(buffer, pos);
                        pos += chunk.length;
                    }
                break;
            }
        });
}
module.exports.Upload = new Upload() ; 