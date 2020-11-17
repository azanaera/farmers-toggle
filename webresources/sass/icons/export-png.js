const path = require("path");
const fs = require('pn/fs'); // Normal filesystem wrapped with promises for async calls
const fileURL = require("file-url");
const childProcess = require("pn/child_process"); // Normal child_process wrapped with promises for async calls
const phantomjsCmd = require("phantomjs-prebuilt").path;
const converterFileName = path.resolve(__dirname, "./convertSvgToPng.js");

const PREFIX = "data:image/png;base64,";
const IMG_OUT_DIR = "../../img/app/print-png/";
const PNG_SIZE = {height: 12};
const imgOutDirPath = path.resolve(__dirname, IMG_OUT_DIR);

if (!fs.existsSync(imgOutDirPath)) {
    fs.mkdirSync(imgOutDirPath)
}

let totalFilesProcessed = 0;
let totalFilesRead = 0;

const exportPngsFromSvgs = (fontName, relativeSvgPath, sync) => {
    console.log("\n\n=========== Begin PNG Generation for Font: " + fontName + " ===========");
    const svgDir = path.resolve(__dirname, relativeSvgPath);

    if (!fs.existsSync(svgDir)) {
        console.debug("Directory for font " + fontName + " not found: " + svgDir);
        return;
    }

    const exportPngInfo = [];

    fs.readdirSync(svgDir).forEach((fileName) => {
        if (fileName.indexOf(".svg") > -1) {
            exportPngInfo.push({path: path.resolve(svgDir, fileName), name: fileName});
        }
    });

    let totalSvgs = exportPngInfo.length;
    let convertedSvgs = 0;
    let pngsWrittenToDisk = 0;
    let errorFiles = 0;

    if (totalSvgs === 0) {
        console.error("Found no SVGs");
        return;
    }

    const report = () => {
        console.log("\n======= Font: " + fontName + " Total SVGs: " + totalSvgs);
        console.log("=======   Converted to PNG: " + convertedSvgs);
        console.log("=======   PNGs written to disk: " + pngsWrittenToDisk);

        if (errorFiles) {
            console.log("=======   ERRORS: " + errorFiles);
        }
    };

    // Font awesome fonts are referred to by -light or -solid in pcfs
    let modifier = "";
    if (fontName.indexOf("light") > -1) {
        modifier = "-light";
    } else  if (fontName.indexOf("solid") > -1) {
        modifier = "-solid";
    }

    // These map to IconTypeEnum.java
    let fontPrefix = "print.svgFileName";
    if (fontName.indexOf("fa") === 0) {
        fontPrefix = "print.gwFontGlyph";
    } else if (fontName.indexOf("customer") === 0) {
        fontPrefix = "print.customerFontGlyph";
    }

    // If sync, then all the calls to the file system and to the svg 2 png conversion are synchronous
    // This, or course, will be dramatically slower than async, but also won't lock down your system,
    // or cause instability in some OS virtual environments
    if (sync) {
        console.log("\nProcessing " + totalSvgs + " SVGs synchronously. Depending on your hardware this could take up to: " + Math.floor(totalSvgs * 3 / 60) + " minutes.");
        exportPngInfo.forEach((svgFileInfo) => {
            try {
                const svgBuffer = fs.readFileSync(svgFileInfo.path);
                const pngBuffer = svgToPngSync(svgBuffer, PNG_SIZE);
                convertedSvgs++;
                const pngFileName = fontPrefix + "." + (svgFileInfo.name.slice(0, -4)) + modifier + ".png";
                fs.writeFileSync(IMG_OUT_DIR + pngFileName, pngBuffer);
                pngsWrittenToDisk++;
            } catch (e) {
                errorFiles++;
                console.error(e);
            }

            report();
        });

        return Promise.resolve(true);
    } else {
        console.log("\nProcessing " + totalSvgs + " SVGs asynchronously. Depending on your hardware this could take up to: " + Math.floor(totalSvgs * 1.3 / 60) + " minutes.");
        // We make async calls to the file system, then wrap up the async calls to the svg converter and to file writer
        // So that we can return all those wrapped up promises as a single array to Promise.all
        const promises = [];
        exportPngInfo.forEach((svgFileInfo) => {
            const readFilePromise = fs.readFile(svgFileInfo.path);
            const finalPromise = new Promise((resolve, reject) => {
                totalFilesRead++;
                printClobberedLine("Opened " + totalFilesRead + " svg files....");
                readFilePromise.then((svgBuffer) => {
                    const svgConverterPromise = svgToPng(svgBuffer, PNG_SIZE, svgFileInfo.name);
                    svgConverterPromise.then(pngBuffer => {
                        convertedSvgs++;
                        const pngFileName = fontPrefix + "." + (svgFileInfo.name.slice(0, -4)) + modifier + ".png";
                        const writeFilePromise = fs.writeFile(IMG_OUT_DIR + pngFileName, pngBuffer);
                        writeFilePromise.then(() => {
                            pngsWrittenToDisk++;
                            resolve();
                        }).catch(e => reject(e))
                    }).catch(e => reject(e))
                }).catch(e => reject(e))
            });

            promises.push(finalPromise);
            finalPromise.catch(e => {console.error(e); errorFiles++});
        });

        const allPromises = Promise.all(promises);
        allPromises.then(() => report()).catch(e => console.error(e));
        return allPromises;
    }
};

// ============== These svg to png methods are cribbed and modified from the svg2png free license node js library =============
const svgToPng = (sourceBuffer, options, fileNameForDebug) => {
    return Promise.resolve().then(() => { // catch thrown errors
        const cp = childProcess.execFile(phantomjsCmd, getPhantomJSArgs(options), { maxBuffer: Infinity });
        if (!cp.stdin) {
            throw new Error("No stdin on promise for options: " + fileNameForDebug);
        }
        writeBufferInChunks(cp.stdin, sourceBuffer);

        return cp.promise.then(processResult);
    });
};

const svgToPngSync = (sourceBuffer, options) => {
    const result = childProcess.spawnSync(phantomjsCmd, getPhantomJSArgs(options), {
        input: sourceBuffer.toString("utf8")
    });
    return processResult(result);
};

function getPhantomJSArgs(options = {}) {
    if (options.filename !== undefined && options.url !== undefined) {
        throw new Error("Cannot specify both filename and url options");
    }

    // Convert filename option to url option
    if (options.filename !== undefined) {
        options = Object.assign({ url: fileURL(options.filename) }, options);
        delete options.filename;
    }

    return [
        converterFileName,
        JSON.stringify(options)
    ];
}

function writeBufferInChunks (writableStream, buffer) {
    const asString = buffer.toString("utf8");

    const INCREMENT = 1024;

    writableStream.cork();
    for (let offset = 0; offset < asString.length; offset += INCREMENT) {
        writableStream.write(asString.substring(offset, offset + INCREMENT));
    }
    writableStream.end();
}

function printClobberedLine(info){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(info);
}

function processResult(result) {
    totalFilesProcessed++;
    printClobberedLine("Converted " + totalFilesProcessed + " svg files to png files...");
    const stdout = result.stdout.toString();
    if (stdout.startsWith(PREFIX)) {
        return new Buffer(stdout.substring(PREFIX.length), "base64");
    }

    if (stdout.length > 0) {
        // PhantomJS always outputs to stdout.
        throw new Error(stdout.replace(/\r/g, "").trim());
    }

    const stderr = result.stderr.toString();
    if (stderr.length > 0) {
        // But hey something else might get to stderr.
        throw new Error(stderr.replace(/\r/g, "").trim());
    }

    throw new Error("No data received from the PhantomJS child process");
}

// ====================================

// ============ EXECUTE ===============

// First arg provided to the node export-png.js
const arg = process.argv[2] || "svg";
const sync = process.argv[3] === "sync";

const promises = [];

if (arg === "svg") {
    promises.push(exportPngsFromSvgs("gw-font", "svg/gw", sync));
} else if (arg === "customer") {
    promises.push(exportPngsFromSvgs("customer-font", "svg/customer", sync));
} else if (arg === "fa-regular") {
    promises.push(exportPngsFromSvgs("fa-regular", "svg/fa5/regular", sync));
} else if (arg === "fa-light") {
    promises.push(exportPngsFromSvgs("fa-light", "svg/fa5/light", sync));
} else if (arg === "fa-solid") {
    promises.push(exportPngsFromSvgs("fa-solid", "svg/fa5/solid", sync));
} else if (arg === "fa-brands") {
    promises.push(exportPngsFromSvgs("fa-brands", "svg/fa5/brands", sync));
} else if (arg === "all-sync") {
    promises.push(exportPngsFromSvgs("gw-font", "svg/gw", true));
    promises.push(exportPngsFromSvgs("customer-font", "svg/customer", true));
    promises.push(exportPngsFromSvgs("fa-regular", "svg/fa5/regular", true));
    promises.push(exportPngsFromSvgs("fa-light", "svg/fa5/light", true));
    promises.push(exportPngsFromSvgs("fa-solid", "svg/fa5/solid", true));
    promises.push(exportPngsFromSvgs("fa-brands", "svg/fa5/brands", true));
} else {
    console.error("Unknown argument passed to export-png.js: " + arg);
}
//TODO: add an option to only update recently modified icon files

Promise.all(promises).then(() => {
    console.log("============ ALL PNG PROCESSING COMPLETE ==============");
});
