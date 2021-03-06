const chai = require("chai"), assert = chai.assert;

describe("express-chrono", () => {
    it("should require", () => {
        const chrono = require("./index");
    });

    it("should have middleware", () => {
        const chrono = require("./index");

        assert.isFunction(chrono);

        const chronoExpress = chrono();

        assert.property(chronoExpress, "middleware");
        assert.isObject(chronoExpress.middleware);

        assert.property(chronoExpress.middleware, "start");
        assert.property(chronoExpress.middleware, "stop");

        assert.property(chronoExpress, "Chronometer");
    });

    it("can measure time", (done) => {
        const chrono = require("./index")();

        let req = {};

        chrono.middleware.start(req, {}, () => {
            assert.property(req, "chrono");
        });

        setTimeout(() => {
            chrono.middleware.stop(req, {}, () => {
                assert.property(req, "chrono");

                // this will be approximately 10ms +/- a few microseconds
                assert.equal(Math.floor(req.chrono.valueOf() * 100)*10, 10);
                done();
            });
        }, 10);
    });
});
