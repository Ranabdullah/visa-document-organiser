'use strict';
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const port=Number(process.argv[2] || 8118);
const assets=new Map([
  ['/',['index.html','text/html; charset=utf-8']],
  ['/index.html',['index.html','text/html; charset=utf-8']],
  ['/app.js',['app.js','text/javascript; charset=utf-8']],
  ['/style.css',['style.css','text/css; charset=utf-8']]
]);
const server=http.createServer(async (request,response)=>{
  const route=(request.url || '').split('?')[0];
  const asset=assets.get(route);
  if(request.method!=='GET' || !asset){
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const body=await fs.readFile(path.join(__dirname,asset[0]));
    response.writeHead(200,{
      'Content-Type':asset[1],
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':"default-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
    }).end(body);
  } catch { response.writeHead(500).end('Could not read the demo file'); }
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log('Open http://127.0.0.1:'+port+'/ in your browser.'));
