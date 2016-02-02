
// ---------------------------- LOAD CANVAS ---------------------------- //
window.onload = function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    console.log("loaded canvas");
    genImgData();

    // ------------ LOADING DATA ----------- //
    function genImgData() {

        console.log("loading img data");
        var img = document.getElementById("fabric");

        ctx.drawImage(img, 0, 0);
        //copies the pixel data (RGBA) for the specified rectangle on the canvas
        window.imgData = ctx.getImageData(0, 0, c.width, c.height);
        window.fabricData = window.imgData;

        for (j = 1; j <= 138; j += 1) {
        var name = "img" + j;
        var newImage = document.getElementById(name);
        ctx.drawImage(newImage, 0, 0);
        window.imageData = ctx.getImageData(0, 0, c.width, c.height);
        window["imgData" + j] = window.imageData;
        }

        convertRGBtoHEX();
    };
};

// ---------------------------- CONVERT RBG TO HEX ---------------------------- //

function convertRGBtoHEX() {
    var hexValues = [];
    var i;
    for (i = 0; i < window.fabricData.data.length; i += 4) {
        hexValues.push( rgbToHex(window.fabricData.data[i], window.fabricData.data[i+1], window.fabricData.data[i+2]) );
    }
    findClosestHex(hexValues);

    //convert rgb values to hex
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return componentToHex(r) + componentToHex(g) + componentToHex(b);
    }   
};

// ---------------------------- FIND CLOSEST HEX & REPLACE PIXELS ---------------------------- //

function findClosestHex(listHex) {
    // convert the `colors`-object to an array
    var colorsArr = [];
    for(var key in colorsLimited) {
        colorsArr.push(key);
    }
    
    window.hexValuesClosest = [];
    var j;
    for (j = 0; j < listHex.length; j += 1) {
        var match = Array.closest(colorsArr, listHex[j]);
          
        for (var prop in colorsLimited) {
            if (match == prop){
                //console.log(j);
                tempAccess1 = "window.imgData" + colorsLimited[match] + ".data[" + (j*4) + "]";
                tempAccess2 = "window.imgData" + colorsLimited[match] + ".data[" + (j*4 + 1) + "]";
                tempAccess3 = "window.imgData" + colorsLimited[match] + ".data[" + (j*4 + 2) + "]";
                //console.log(colorsLimited[match]);
                //console.log(eval(tempAccess1));
                window.fabricData.data[j*4] = eval(tempAccess1);
                window.fabricData.data[(j*4) + 1] = eval(tempAccess2);
                window.fabricData.data[(j*4) + 2] = eval(tempAccess3);
            }
        }

        hexValuesClosest.push( match );
        //console.log( colors[match] );
    }
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    //console.log("about to display final image");
    ctx.putImageData(window.fabricData, 0, 0);
};

// ----------- FIND CLOSEST COLOR ------------- //

Array.closest = (function () {
    function dist(s, t) {
        if (!s.length || !t.length) return 0;
        return dist(s.slice(2), t.slice(2)) +
            Math.abs(parseInt(s.slice(0, 2), 16) - parseInt(t.slice(0, 2), 16));
    }

    return function (arr, str) {
        var min = 0xffffff;
        var best, current, i;
        for (i = 0; i < arr.length; i++) {
            current = dist(arr[i], str)
            if (current < min) {
                min = current
                best = arr[i];
            }
        }
        return best;
    };
}());
