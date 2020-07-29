# The Kitchen Sink

It's the distant future, and the world has become a shadow of its former self with corruption and discontent rife throughout all levels of society. But one hope still remains, humanities greatest weapon of last resort is on the brink of deployment. But it just needs a little more time before it can be used. It falls on you, to protect the Kitchen Sink until it is ready to save the world.

# Running

```
npm run build
npm run debug
```

Then, goto [here](http://localhost:5000) in your prefered browser.

# Docker

You can also build the project into a standalone docker container.

```
npm run build
docker build -t ludumdare32:dev .
docker run --rm -p 5000:80 -m 32 ludumdare32:dev
```

Then, goto [here](http://localhost:5000) in your prefered browser.
