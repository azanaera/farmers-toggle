/* eslint-env phantomjs */
/* eslint-disable no-console, no-var, prefer-arrow-callback, object-shorthand */
"use strict";

var webpage = require("webpage");
var system = require("system");

var HTML_PREFIX = "<!DOCTYPE html><style>html, body { margin: 0; padding: 0; } " +
    "svg { position: absolute; top: 0; left: 0; }</style>";

if (system.args.length !== 2) {
    console.error("Usage: converter.js options");
    phantom.exit();
} else {
    convert(system.args[1]);
}

/**
 * This file is cribbed and modified from the node svg2png free license library
 * @param options
 */
function convert(options) {
    try {
        options = JSON.parse(options);
    } catch (e) {
        console.error("Unable to parse options.");
        console.error(e);
        phantom.exit();
        return;
    }

    var page = webpage.create();
    var source = "";
    while (!system.stdin.atEnd()) {
        source += system.stdin.readLine() + "\n";
    }

    page.onLoadFinished = function (status) {
        if (status !== "success") {
            console.error("Unable to load the source file.");
            phantom.exit();
            return;
        }

        try {
            var width = options.width;
            var height = options.height;
            var size = getSizeBasedOnOptionsAndViewbox(page, width, height);

            setSVGSize(page, size);

            page.viewportSize = {
                width: size.w,
                height: size.h
            };
            page.clipRect = {
                top: 0,
                left: 0,
                width: size.w,
                height: size.h
            };
        } catch (e) {
            console.error("Unable to calculate or set dimensions.");
            console.error(e);
            phantom.exit();
            return;
        }

        var result = "data:image/png;base64," + page.renderBase64("PNG");
        system.stdout.write(result);
        phantom.exit();
    };

    // PhantomJS will always render things empty if you choose about:blank, so that's why the different default URL.
    // PhantomJS's setContent always assumes HTML, not SVG, so we have to massage the page into usable HTML first.
    page.setContent(HTML_PREFIX + source, options.url || "http://example.com/");
}

function setSVGSize(page, size) {
    page.evaluate(function (w, h) {
        /* global document: false */
        var el = document.querySelector("svg");

        el.setAttribute("width", w + "px");
        el.setAttribute("height", h + "px");

    }, size.w, size.h);
}

function getSizeBasedOnOptionsAndViewbox(page, width, height) {
    return page.evaluate(function (w, h) {
        /* global document: false */

        var el = document.querySelector("svg");

        if (w && h) {
            return { w: w, h: h };
        }

        var viewBoxWidth = el.viewBox.animVal.width;
        var viewBoxHeight = el.viewBox.animVal.height;

        if (w) {
            return { w: w, h: h * viewBoxHeight / viewBoxWidth };
        }

        return { w: h * viewBoxWidth / viewBoxHeight, h: h };
    }, width, height);
}
