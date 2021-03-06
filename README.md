# express-chrono
Simple [process.hrtime](https://nodejs.org/api/process.html#process_process_hrtime_time) chronometer with Expressjs middleware. Request timer, process timer.

```

const express = require("express");

const app = express();

const chrono = require("express-chrono")({ header: true });

app.use(chrono.middleware.start);

app.get("/", (req, res, next)=> {
  res.send("Hello World");
  next();
});

app.use(chrono.middleware.stop);

app.use((req, res, next) => {
  console.log(req.chrono);
});

app.listen(3000);

```

**Options**

*header* - boolean or string of the header name. Defaults to false. If true the default header is X-Response-Time

*format* 
 * *s* - seconds, e.g `1.029382120s`
 * *ms* - milliseconds, default, e.g `1029.382120ms`
 
*suffix* - boolean, default false; include the second or millisecond suffix

**Module**

`const chrono = require("express-chrono")(options);`

*chrono.middleware*

* *start* - express start middleware, put this before the request. Creates a field `chrono` on req of type `Chronometer`
* *stop* - express stop middleware, put this after the request. Stops the timer on `req.chrono`. You can stop the timer at any time from `req.chrono.stop()` or look at the current accumulated time `req.chrono.parse()`

**class *Chronometer***

*constructor(options)* - options, same as above, except header

**Properties**

*diff* - returns start time hrtime diff of now or diff since stopped.
*hrtime* - hrtime at start or now if not started.

**Methods**

*start()* - starts the chronometer at that moment

*stop()* - stops the chronometer at that moment

*parse(format, suffix)* - returns the parsed time so far or since stopped. format and suffix are optional, inheritted from constructor, if provided they will override Chronometer instance options.

*toJSON()* - returns parse()

*toString()* - returns parse()

*valueOf()* - returns current diff or diff since stopped in seconds fixed decimal number with percision of 9. 

```

const Chronometer = require("express-chrono").Chronometer;
 
 let chrono = new Chronometer({ format: "s", suffix: true });
 
 chrono.start();
 
 setTimeout(() => {
   chrono.stop();
   
   console.log(chrono); // 0.100000000ms
 }, 100);

```
