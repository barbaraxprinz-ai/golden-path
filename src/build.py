s=open('src/app.html').read()
s=s.replace('/*DATA*/',open('src/data.js').read()).replace('/*BOARD*/',open('src/board.js').read())
open('index.html','w').write(s)
