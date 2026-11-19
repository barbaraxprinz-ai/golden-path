s=open('src/app.html').read()
s=s.replace('/*DATA*/',open('src/data.js').read()).replace('/*DATA2*/',open('src/data2.js').read() if __import__('os').path.exists('src/data2.js') else '').replace('/*DATA3*/',open('src/data3.js').read() if __import__('os').path.exists('src/data3.js') else '').replace('/*BOARD*/',open('src/board.js').read()).replace('/*FONTS*/',open('src/fonts.css').read())
open('index.html','w').write(s)
