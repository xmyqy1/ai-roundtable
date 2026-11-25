#!/bin/sh
# 把 src/ 里的代码转换成老版本浏览器也能运行的语法
ESBUILD=${ESBUILD:-esbuild}
for f in app.js content.js sites.js; do $ESBUILD src/$f --target=chrome64 --outfile=$f --log-level=warning; done
