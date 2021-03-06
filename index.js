class Chronometer {
    constructor(options) {
        this.options = options || {};

        this._running = false;
        this._hrtime = process.hrtime();
        this._diff = [0,0];
    }

    get hrtime() {
        if (!this._hrtime) this._hrtime = process.hrtime();

        return this._hrtime;
    }

    get diff() {
        if (this._running) return process.hrtime(this._hrtime);

        return this._diff;
    }

    start() {
        this._running = true;
        this._hrtime = process.hrtime();

        return this.hrtime;
    }

    stop() {
        this._running = false;
        this._diff = process.hrtime(this.hrtime);

        return this.diff;
    }

    parse(format, suffix) {
        format = (format === undefined) ? this.options.format || "ms" : format;
        suffix = (suffix === undefined) ? this.options.suffix || false : suffix;

        let val = null;

        switch(format) {
            case "ms": // ms, milliseconds
                val = this.valueOf();
                val = (val * 1000).toFixed(6);
                if (suffix) val += "ms";
                break;
            default: // s, seconds
                val = this.valueOf();
                if (suffix) val += "s";
        }

        return val;
    }

    toJSON() {
        return this.parse();
    }

    toString() {
        return this.parse();
    }

    valueOf() { // seconds
        let diff = this.diff;

        return (diff[0] + (diff[1]*1e-9)).toFixed(9);
    }
}

module.exports = (options) => {
    let opts = Object.assign({}, options);

    if (opts.header && !(typeof opts.header === 'string' || opts.header instanceof String)) {
        opts.header = "X-Response-Time";
    } else {
        opts.header = false;
    }

    opts.format = opts.format || "ms";
    opts.suffix = opts.suffix || false;

    return {
        Chronometer: Chronometer,
        middleware: {
            start: (req, res, next) => {
                if (!req.chrono) req.chrono = new Chronometer(opts);

                req.chrono.start();

                next();
            },
            stop: (req, res, next) => {
                if (!req.chrono) req.chrono = new Chronometer(opts);

                req.chrono.stop();

                if (opts.header) res.set(opts.header, req.chrono.parse());

                next();
            }
        }
    };
};
