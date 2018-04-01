({
  requires: [
    { "import-type": "builtin", "name": "image-lib" }
  ],
  nativeRequires: [
    "pyret-base/js/js-numbers"
  ],
  provides: {
    values: {
      "circle": "tany",
      "is-image-color": "tany",
      "is-mode": "tany",
      "is-x-place": "tany",
      "is-y-place": "tany",
      "is-angle": "tany",
      "is-side-count": "tany",
      "is-step-count": "tany",
      "is-image": "tany",
      "bitmap-url": "tany",
      "image-url": "tany",
      "images-equal": "tany",
      "images-difference": "tany",
      "text": "tany",
      "text-font": "tany",
      "overlay": "tany",
      "overlay-xy": "tany",
      "overlay-align": "tany",
      "underlay": "tany",
      "underlay-xy": "tany",
      "underlay-align": "tany",
      "beside": "tany",
      "beside-align": "tany",
      "above": "tany",
      "above-align": "tany",
      "empty-scene": "tany",
      "empty-color-scene": "tany",
      "put-image": "tany",
      "translate": "tany",
      "place-image": "tany",
      "place-image-align": "tany",
      "place-pinhole": "tany",
      "center-pinhole": "tany",
      "rotate": "tany",
      "scale": "tany",
      "scale-xy": "tany",
      "flip-horizontal": "tany",
      "flip-vertical": "tany",
      "frame": "tany",
      "draw-pinhole": "tany",
      "crop": "tany",
      "line": "tany",
      "add-line": "tany",
      "scene-line": "tany",
      "square": "tany",
      "rectangle": "tany",
      "regular-polygon": "tany",
      "ellipse": "tany",
      "wedge": "tany",
      "triangle": "tany",
      "triangle-sas": "tany",
      "triangle-sss": "tany",
      "triangle-ass": "tany",
      "triangle-ssa": "tany",
      "triangle-aas": "tany",
      "triangle-asa": "tany",
      "triangle-saa": "tany",
      "right-triangle": "tany",
      "isosceles-triangle": "tany",
      "star": "tany",
      "star-sized": "tany",
      "radial-star": "tany",
      "star-polygon": "tany",
      "rhombus": "tany",
      "image-to-color-list": "tany",
      "color-list-to-image": "tany",
      "color-list-to-bitmap": "tany",
      "image-width": "tany",
      "image-height": "tany",
      "image-baseline": "tany",
      "name-to-color": "tany",
      "empty-image": "tany"
    },
    aliases: {
      "Image": ["local", "Image"]
    },
    datatypes: { "Image": ["data", "Image", [], [], {}] }
  },
  theModule: function(runtime, namespace, uri, image, jsnums) {
    var colorDb = image.colorDb;
    var ffi = runtime.ffi

    var isString = runtime.isString;

    var isFontFamily = function(x){
      return (isString(x) &&
              (x.toString().toLowerCase() == "default" ||
               x.toString().toLowerCase() == "decorative" ||
               x.toString().toLowerCase() == "roman" ||
               x.toString().toLowerCase() == "script" ||
               x.toString().toLowerCase() == "swiss" ||
               x.toString().toLowerCase() == "modern" ||
               x.toString().toLowerCase() == "symbol" ||
               x.toString().toLowerCase() == "system"))
        || (x === false);		// false is also acceptable
    };
    var isFontStyle = function(x){
      return (isString(x) &&
              (x.toString().toLowerCase() == "normal" ||
               x.toString().toLowerCase() == "italic" ||
               x.toString().toLowerCase() == "slant"))
        || (x === false);		// false is also acceptable
    };
    var isFontWeight = function(x){
      return (isString(x) &&
              (x.toString().toLowerCase() == "normal" ||
               x.toString().toLowerCase() == "bold" ||
               x.toString().toLowerCase() == "light"))
        || (x === false);		// false is also acceptable
    };
    var isMode = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "solid" ||
               x.toString().toLowerCase() == "outline")) ||
        ((jsnums.isReal(x)) &&
         (jsnums.greaterThanOrEqual(x, 0, runtime.NumberErrbacks) &&
          jsnums.lessThanOrEqual(x, 1, runtime.NumberErrbacks)));
    };

    var isPlaceX = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "left"  ||
               x.toString().toLowerCase() == "right" ||
               x.toString().toLowerCase() == "center" ||
               x.toString().toLowerCase() == "pinhole" ||
               x.toString().toLowerCase() == "middle"));
    };

    var isPlaceY = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "top"	  ||
               x.toString().toLowerCase() == "bottom"   ||
               x.toString().toLowerCase() == "baseline" ||
               x.toString().toLowerCase() == "center"   ||
               x.toString().toLowerCase() == "pinhole"  ||
               x.toString().toLowerCase() == "middle"));
    };

    var isStyle = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "solid" ||
               x.toString().toLowerCase() == "outline"));
    };

    var less = function(lhs, rhs) {
      return (rhs - lhs) > 0.00001;
    }

    var p = function(pred, name) {
      return function(val) { runtime.makeCheckType(pred, name)(val); return val; }
    }

    var ann = function(name, pred) {
      return runtime.makePrimitiveAnn(name, pred);
    };

    var annString = runtime.String;
    var annNumber = runtime.Number;
    var annPositive = runtime.NumPositive;
    var annNumNonNegative = runtime.NumNonNegative;

    var checkString = p(runtime.isString, "String");
    var checkStringOrFalse = p(function(val) { return runtime.isString(val) || runtime.isPyretFalse; }, "String or false");
    var annStringOrFalse = ann("String or false", function(val) { return runtime.isString(val) || runtime.isPyretFalse; });

    var annByte = ann("Number between 0 and 255", function(val) {
      return runtime.isNumber(val)
        && jsnums.greaterThanOrEqual(val, 0, runtime.NumberErrbacks)
        && jsnums.greaterThanOrEqual(255, val, runtime.NumberErrbacks);
    });
    var annReal = ann("Real Number", function(val) {
      return runtime.isNumber(val) && jsnums.isReal(val);
    });

    var annNatural = ann("Natural Number", function(val) {
      return runtime.isNumber(val) && jsnums.isInteger(val)
        && jsnums.greaterThanOrEqual(val, 0, runtime.NumberErrbacks);
    });

    var annPositiveInteger = ann("Positive Integer", function(val) {
      return runtime.isNumber(val) && jsnums.isInteger(val)
        && jsnums.greaterThanOrEqual(val, 0, runtime.NumberErrbacks);
    });


    var _checkColor = p(image.isColorOrColorString, "Color");

    var annColor = ann("Color", image.isColorOrColorString);

    var unwrapColor = function(val) {
      var aColor = _checkColor(val);
      if (colorDb.get(aColor)) {
        aColor = colorDb.get(aColor);
      }
      return aColor;
    };

    var checkImagePred = function(val) {
      return runtime.isOpaque(val) && image.isImage(val.val);
    };
    var annImage = ann("Image", checkImagePred);
    var unwrapImage = function(val) {
      return val.val;
    }
    var checkImageOrScenePred = function(val) {
      return runtime.isOpaque(val) && (image.isImage(val.val) || image.isScene(val.val));
    };
    var annImageOrScene = ann("Image", checkImageOrScenePred);
    var unwrapImageOrScene = function(val) {
      return val.val;
    }

    var checkScenePred = function(val) {
      return runtime.isOpaque(val) && image.isScene(val.val);
    };

    var annFontFamily = ann("Font Family", isFontFamily);
    var checkFontFamily = p(isFontFamily, "Font Family");

    var annFontStyle = ann("Font Style (\"normal\", \"italic\", or \"slant\")", isFontStyle);
    var checkFontStyle = p(isFontStyle, "Font Style");

    var annFontWeight = ann("Font Weight", isFontWeight);
    var checkFontWeight = p(isFontWeight, "Font Weight");

    var annPlaceX = ann("X Place (\"left\", \"middle\", \"center\", \"pinhole\", or \"right\")", isPlaceX);
    var unwrapPlaceX = function(val) {
      if (val.toString().toLowerCase() == "center") return "middle";
      return val;
    };
    
    var annPlaceY = ann("Y Place (\"top\", \"bottom\", \"center\", \"pinhole\", \"baseline\", or \"middle\")", isPlaceY);
    var unwrapPlaceY = function(val) {
      if (val.toString().toLowerCase() == "middle") return "center";
      return val;
    };


    var annAngle = ann("Angle (a number 'x' where 0 <= x < 360)", image.isAngle);
    var checkAngle = p(image.isAngle, "Angle");

    var canonicalizeAngle = function(angle) {
      angle = jsnums.remainder(angle, 360, runtime.NumberErrbacks);
      if (jsnums.lessThan(angle, 0, runtime.NumberErrbacks)) {
        angle = jsnums.add(angle, 360, runtime.NumberErrbacks);
      }
      return angle;
    };

    var annListColor = ann("List<Color>", function(val) {
      return runtime.ffi.isList(val);
    });
    var unwrapListofColor = p(function(val) {
      return ffi.makeList(ffi.toArray(val).map(unwrapColor));
    }, "List<Color>");


    var unwrapMode = function(val) {
      if (typeof val === "string")
        return val;
      else
        return jsnums.toFixnum(val);
    }
    var annMode = ann("Mode (\"outline\" or \"solid\")", isMode);

    var annSideCount = ann("Side Count", image.isSideCount);

    var annStepCount = ann("Step Count", image.isStepCount);

    var annPointCount = ann("Points Count", image.isPointsCount);

    var checkArity = ffi.checkArity;

    var throwMessage = ffi.throwMessageException;

    function makeImage(i) {
      return runtime.makeOpaque(i, image.imageEquals);
    }

    // Useful trigonometric functions based on htdp teachpack

    // excess : compute the Euclidean excess
    //  Note: If the excess is 0, then C is 90 deg.
    //        If the excess is negative, then C is obtuse.
    //        If the excess is positive, then C is acuse.
    function excess(sideA, sideB, sideC) {
      return sideA*sideA + sideB*sideB - sideC*sideC;
    }

    // return c^2 = a^2 + b^2 - 2ab cos(C)
    function cosRel(sideA, sideB, angleC) {
      return (sideA*sideA) + (sideB*sideB) - (2*sideA*sideB*Math.cos(angleC * Math.PI/180));
    }

    var c = function(name, ...argsAndAnns) {
      runtime.checkArgsInternalInline("image-untyped", name, ...argsAndAnns);
    };
    var c1 = function(name, arg, ann) {
      runtime.checkArgsInternal1("image", name, arg, ann);
    };
    var c2 = function(name, arg1, ann1, arg2, ann2) {
      runtime.checkArgsInternal2("image", name, arg1, ann1, arg2, ann2);
    };
    var c3 = function(name, arg1, ann1, arg2, ann2, arg3, ann3) {
      runtime.checkArgsInternal3("image", name, arg1, ann1, arg2, ann2, arg3, ann3);
    };
    //////////////////////////////////////////////////////////////////////
    var bitmapURL = function(maybeUrl) {
      c1("image-url", maybeUrl, annString);
      var url = maybeUrl;
      return runtime.pauseStack(function(restarter) {
        var rawImage = new Image();
        if(runtime.hasParam("imgUrlProxy")) {
          url = runtime.getParam("imgUrlProxy")(url);
        }
        rawImage.onload = function() {
          restarter.resume(makeImage(image.makeFileImage(String(url), rawImage)));
        };
        rawImage.onerror = function(e) {
          restarter.error(runtime.ffi.makeMessageException("unable to load " + url + ": " + e.message));
        };
        rawImage.src = String(url);
      });
    };
    var values = {};
    function f(name, fun) {
      values[name] = runtime.makeFunction(fun, name);
    }
    f("circle", function(radius, maybeMode, maybeColor) {
      checkArity(3, arguments, "image", false);
      c3("circle", radius, annNumNonNegative, maybeMode, annMode, maybeColor, annColor);
      var color = unwrapColor(maybeColor);
      var mode = unwrapMode(maybeMode)
      return makeImage(image.makeCircleImage(jsnums.toFixnum(radius), mode, color));
    });
    f("is-image-color", function(maybeColor) {
      checkArity(1, arguments, "image", false);
      return runtime.wrap(image.isColorOrColorString(maybeColor));
    });
    f("is-mode", function(maybeMode) {
      checkArity(1, arguments, "is-mode", false);
      return runtime.wrap(isMode(maybeMode));
    });
    f("is-x-place", function(maybeXPlace) {
      checkArity(1, arguments, "is-x-place", false);
      return runtime.wrap(isPlaceX(maybeXPlace));
    });
    f("is-y-place", function(maybeYPlace) {
      checkArity(1, arguments, "is-y-place", false);
      return runtime.wrap(isPlaceY(maybeYPlace));
    });
    f("is-angle", function(maybeAngle) {
      checkArity(1, arguments, "is-angle", false);
      return runtime.wrap(image.isAngle(maybeAngle));
    });
    f("is-side-count", function(maybeSideCount) {
      checkArity(1, arguments, "is-side-count", false);
      return runtime.wrap(image.isSideCount(maybeSideCount));
    });
    f("is-step-count", function(maybeStepCount) {
      checkArity(1, arguments, "is-step-count", false);
      return runtime.wrap(image.isStepCount(maybeStepCount));
    });
    f("is-image", function(maybeImage) {
      checkArity(1, arguments, "is-image", false);
      runtime.confirm(maybeImage, runtime.isOpaque);
      return runtime.wrap(image.isImage(maybeImage.val));
    });
    f("bitmap-url", function(maybeURL) {
      checkArity(1, arguments, "bitmap-url", false);
      return bitmapURL(maybeURL);
    }),
    f("image-url", function(maybeURL) {
      checkArity(1, arguments, "image-url", false);
      return bitmapURL(maybeURL);
    }),
    f("images-difference", function(maybeImage1, maybeImage2) {
      checkArity(2, arguments, "image", false);
      c2("images-difference", maybeImage1, annImage, maybeImage2, annImage);
      var img1 = unwrapImage(maybeImage1);
      var img2 = unwrapImage(maybeImage2);
      return runtime.wrap(image.imageDifference(img1, img2));
    });
    f("images-equal", function(maybeImage1, maybeImage2) {
      checkArity(2, arguments, "image", false);
      c2("images-equal", maybeImage1, annImage, maybeImage2, annImage);
      var img1 = unwrapImage(maybeImage1);
      var img2 = unwrapImage(maybeImage2);
      return runtime.wrap(image.imageEquals(img1, img2));
    });
    f("text", function(maybeString, maybeSize, maybeColor) {
      checkArity(3, arguments, "image", false);
      c3("text", maybeString, runtime.String, maybeSize, annByte, maybeColor, annColor);
      var string = checkString(maybeString);
      var size = jsnums.toFixnum(maybeSize);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeTextImage(String(string), size, color,
                            "normal", "Optimer", "", "", false));
    });
    f("text-font", function(maybeString, maybeSize, maybeColor, maybeFace,
                            maybeFamily, maybeStyle, maybeWeight, maybeUnderline) {
      checkArity(8, arguments, "image", false);
      c("text-font", 
        maybeString, runtime.String,
        maybeSize, annByte,
        maybeColor, annColor,
        maybeFace, annStringOrFalse,
        maybeFamily, annFontFamily,
        maybeStyle, annFontStyle,
        maybeWeight, annFontWeight,
        maybeUnderline, runtime.Boolean);
      var string = maybeString;
      var size = jsnums.toFixnum(maybeSize);
      var color = unwrapColor(maybeColor);
      var face = maybeFace;
      var family = maybeFamily;
      var style = maybeStyle;
      var weight = maybeWeight;
      var underline = maybeUnderline;
      return makeImage(
        image.makeTextImage(String(string), size, color,
                            face, family, style, weight, underline));
    }),

    f("overlay", function(maybeImg1, maybeImg2) {
      checkArity(2, arguments, "overlay", false);
      c2("overlay", maybeImg1, annImage, maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, "pinhole", "pinhole", 0, 0, img2, "pinhole", "pinhole"));
    });

    f("overlay-xy", function(maybeImg1, maybeDx, maybeDy, maybeImg2) {
      checkArity(4, arguments, "overlay-xy", false);
      c("overlay-xy",
        maybeImg1, annImage,
        maybeDx, annReal,
        maybeDy, annReal,
        maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var dx = jsnums.toFixnum(maybeDx);
      var dy = jsnums.toFixnum(maybeDy);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(
        image.makeOverlayImage(img1, "left", "top", dx, dy, img2, "left", "top"));
    });

    f("overlay-align", function(maybePlaceX, maybePlaceY, maybeImg1, maybeImg2) {
      checkArity(4, arguments, "overlay-align", false);
      c("overlay-align",
        maybePlaceX, annPlaceX,
        maybePlaceY, annPlaceY,
        maybeImg1, annImage,
        maybeImg2, annImage);
      var placeX = unwrapPlaceX(maybePlaceX);
      var placeY = unwrapPlaceY(maybePlaceY);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, placeX, placeY, 0, 0, img2, placeX, placeY));
    });

    f("underlay", function(maybeImg1, maybeImg2) {
      checkArity(2, arguments, "underlay", false);
      c2("underlay", maybeImg1, annImage, maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img2, "pinhole", "pinhole", 0, 0, img1, "pinhole", "pinhole"));
    });

    f("underlay-xy", function(maybeImg1, maybeDx, maybeDy, maybeImg2) {
      checkArity(4, arguments, "underlay-xy", false);
      c("underlay-xy",
        maybeImg1, annImage,
        maybeDx, annReal,
        maybeDy, annReal,
        maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var dx = jsnums.toFixnum(maybeDx);
      var dy = jsnums.toFixnum(maybeDy);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(
        image.makeOverlayImage(img2, "left", "top", -dx, -dy, img1, "left", "top"));
    });

    f("underlay-align", function(maybePlaceX, maybePlaceY, maybeImg1, maybeImg2) {
      checkArity(4, arguments, "underlay-align", false);
      c("underlay-align",
        maybePlaceX, annPlaceX,
        maybePlaceY, annPlaceY,
        maybeImg1, annImage,
        maybeImg2, annImage);
      var placeX = unwrapPlaceX(maybePlaceX);
      var placeY = unwrapPlaceY(maybePlaceY);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img2, placeX, placeY, 0, 0, img1, placeX, placeY));
    });

    f("beside", function(maybeImg1, maybeImg2) {
      checkArity(2, arguments, "beside", false);
      c2("beside", maybeImg1, annImage, maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, "right", "center", 0, 0, img2, "left", "center"));
    });

    f("beside-align", function(maybePlaceY, maybeImg1, maybeImg2) {
      checkArity(3, arguments, "beside-align", false);
      c3("beside-align", maybePlaceY, annPlaceY, maybeImg1, annImage, maybeImg2, annImage);
      var placeY = unwrapPlaceY(maybePlaceY);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, "right", placeY, 0, 0, img2, "left", placeY));
    });

    f("above", function(maybeImg1, maybeImg2) {
      checkArity(2, arguments, "above", false);
      c2("beside", maybeImg1, annImage, maybeImg2, annImage);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, "middle", "bottom", 0, 0, img2, "middle", "top"));
    });

    f("above-align", function(maybePlaceX, maybeImg1, maybeImg2) {
      checkArity(3, arguments, "above-align", false);
      c3("above-align", maybePlaceX, annPlaceX, maybeImg1, annImage, maybeImg2, annImage);
      var placeX = unwrapPlaceX(maybePlaceX);
      var img1 = unwrapImage(maybeImg1);
      var img2 = unwrapImage(maybeImg2);
      return makeImage(image.makeOverlayImage(img1, placeX, "bottom", 0, 0, img2, placeX, "top"));
    });

    f("empty-scene", function(maybeWidth, maybeHeight) {
      checkArity(2, arguments, "empty-scene", false);
      c2("empty-scene", maybeWidth, annNumNonNegative, maybeHeight, annNumNonNegative);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      return makeImage(
        image.makeSceneImage(width, height, [], true, colorDb.get("transparent")));
    });
    f("empty-color-scene", function(maybeWidth, maybeHeight, maybeColor) {
      checkArity(3, arguments, "empty-color-scene", false);
      c3("empty-color-scene", maybeWidth, annNumNonNegative, maybeHeight, annNumNonNegative, maybeColor, annColor);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeSceneImage(width, height, [], true, color));
    });
    f("put-image", function(maybePicture, maybeX, maybeY, maybeBackground) {
      checkArity(4, arguments, "put-image", false);
      c("put-image",
        maybePicture, annImage,
        maybeX, annReal,
        maybeY, annReal,
        maybeBackground, annImageOrScene);
      var picture = unwrapImage(maybePicture);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      var background = unwrapImageOrScene(maybeBackground);
      if (image.isScene(background)) {
        return makeImage(background.add(picture, x, background.getHeight() - y));
      } else {
        var newScene = image.makeSceneImage(background.getWidth(), background.getHeight(), [], false, colorDb.get("transparent"));
        newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
        newScene = newScene.add(picture, x, background.getHeight() - y);
        return makeImage(newScene);
      }
    });
    f("place-image", function(maybePicture, maybeX, maybeY, maybeBackground) {
      checkArity(4, arguments, "place-image", false);
      c("place-image",
        maybePicture, annImage,
        maybeX, annReal,
        maybeY, annReal,
        maybeBackground, annImageOrScene);
      var picture = unwrapImage(maybePicture);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      var background = unwrapImageOrScene(maybeBackground);
      if (image.isScene(background)) {
        return makeImage(background.add(picture, x, y));
      } else {
        var newScene = image.makeSceneImage(background.getWidth(), background.getHeight(), [], false, colorDb.get("transparent"));
        newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
        newScene = newScene.add(picture, x, y);
        return makeImage(newScene);
      }
    });
    f("translate", values["place-image"].app);
    f("place-pinhole", function(maybeX, maybeY, maybeImg) {
      checkArity(3, arguments, "place-pinhole", false);
      c3("place-pinhole",
         maybeX, annReal,
         maybeY, annReal,
         maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      return makeImage(img.updatePinhole(x, y));
    });
    f("center-pinhole", function(maybeImg) {
      checkArity(1, arguments, "place-pinhole", false);
      c1("place-pinhole", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return makeImage(img.updatePinhole(img.getWidth() / 2, img.getHeight() / 2));
    });
    
    f("place-image-align", function(maybeImg, maybeX, maybeY, maybePlaceX, maybePlaceY, maybeBackground) {
      checkArity(6, arguments, "place-image-align", false);
      c("place-image-align",
        maybeImg, annImage,
        maybeX, annReal,
        maybeY, annReal,
        maybePlaceX, annPlaceX,
        maybePlaceY, annPlaceY,
        maybeBackground, annImageOrScene);
      var img = unwrapImage(maybeImg);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      var placeX = unwrapPlaceX(maybePlaceX);
      var placeY = unwrapPlaceY(maybePlaceY);
      var background = unwrapImageOrScene(maybeBackground);
      if      (placeX == "left"  ) { x = x + img.getWidth()/2; }
      else if (placeX == "right" ) { x = x - img.getWidth()/2; }
      if      (placeY == "top"   ) { y = y + img.getHeight()/2; }
      else if (placeY == "bottom") { y = y - img.getHeight()/2; }

      if (image.isScene(background)) {
        return makeImage(background.add(img, x, y));
      } else {
        var newScene = image.makeSceneImage(background.getWidth(),
                                            background.getHeight(),
                                            [],
                                            false,
                                            colorDb.get("transparent"));
        newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
        newScene = newScene.add(img, x, y);
        return makeImage(newScene);
      }
    });

    f("rotate", function(maybeAngle, maybeImg) {
      checkArity(2, arguments, "rotate", false);
      c2("rotate", maybeAngle, annReal, maybeImg, annImage);
      var angle = jsnums.toFixnum(canonicalizeAngle(maybeAngle));
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeRotateImage(-angle, img));
    });

    f("scale", function(maybeFactor, maybeImg) {
      checkArity(2, arguments, "scale", false);
      c2("scale", maybeFactor, annReal, maybeImg, annImage);
      var factor = jsnums.toFixnum(maybeFactor);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeScaleImage(factor, factor, img));
    });

    f("scale-xy", function(maybeXFactor, maybeYFactor, maybeImg) {
      checkArity(3, arguments, "scale-xy", false);
      c3("scale-xy", maybeXFactor, annReal, maybeYFactor, annReal, maybeImg, annImage);
      var xFactor = jsnums.toFixnum(maybeXFactor);
      var yFactor = jsnums.toFixnum(maybeYFactor);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeScaleImage(xFactor, yFactor, img));
    });

    f("flip-horizontal", function(maybeImg) {
      checkArity(1, arguments, "flip-horizontal", false);
      c1("flip-horizontal", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeFlipImage(img, "horizontal"));
    });

    f("flip-vertical", function(maybeImg) {
      checkArity(1, arguments, "flip-vertical", false);
      c1("flip-vertical", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeFlipImage(img, "vertical"));
    });
    // aliases
    f("reflect-y", values["flip-horizontal"].app);
    f("reflect-x", values["flip-vertical"].app);

    f("frame", function(maybeImg) {
      checkArity(1, arguments, "frame", false);
      c1("frame", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeFrameImage(img));
    });

    f("draw-pinhole", function(maybeImg) {
      checkArity(1, arguments, "draw-pinhole", false);
      c1("draw-pinhole", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makePinholeImage(img));
    });

    f("crop", function(maybeX, maybeY, maybeWidth, maybeHeight, maybeImg) {
      checkArity(5, arguments, "crop", false);
      c("crop",
        maybeX, annReal,
        maybeY, annReal,
        maybeWidth, annNumNonNegative,
        maybeHeight, annNumNonNegative,
        maybeImg, annImage);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      var img = unwrapImage(maybeImg);
      return makeImage(image.makeCropImage(x, y, width, height, img));
    });

    f("line", function(maybeX, maybeY, maybeC) {
      checkArity(3, arguments, "line", false);
      c3("line", maybeX, annReal, maybeY, annReal, maybeC, annColor);
      var x = jsnums.toFixnum(maybeX);
      var y = jsnums.toFixnum(maybeY);
      var color = unwrapColor(maybeC);
      return makeImage(
        image.makeLineImage(x, y, color));
    });

    f("add-line", function(maybeImg, maybeX1, maybeY1, maybeX2, maybeY2, maybeC) {
      checkArity(6, arguments, "add-line", false);
      c("add-line",
        maybeImg, annImage,
        maybeX1, annReal,
        maybeY1, annReal,
        maybeX2, annReal,
        maybeY2, annReal,
        maybeC, annColor);
      var x1 = jsnums.toFixnum(maybeX1);
      var y1 = jsnums.toFixnum(maybeY1);
      var x2 = jsnums.toFixnum(maybeX2);
      var y2 = jsnums.toFixnum(maybeY2);
      var color = unwrapColor(maybeC);
      var img   = unwrapImage(maybeImg);
      var line  = image.makeLineImage(x2 - x1, y2 - y1, color);
      var leftmost = Math.min(x1, x2);
      var topmost  = Math.min(y1, y2);
      return makeImage(image.makeOverlayImage(line, "middle", "center", -leftmost, -topmost, img, "middle", "center"));
    });

    f("scene-line", function(maybeImg, maybeX1, maybeY1, maybeX2, maybeY2, maybeC) {
      checkArity(6, arguments, "scene-line", false);
      c("scene-line",
        maybeImg, annImage,
        maybeX1, annReal,
        maybeY1, annReal,
        maybeX2, annReal,
        maybeY2, annReal,
        maybeC, annColor);
      var x1 = jsnums.toFixnum(maybeX1);
      var y1 = jsnums.toFixnum(maybeY1);
      var x2 = jsnums.toFixnum(maybeX2);
      var y2 = jsnums.toFixnum(maybeY2);
      var color = unwrapColor(maybeC);
      var img = unwrapImage(maybeImg);
      var line = image.makeLineImage(x2 - x1, y2 - y1, color);

      var newScene = image.makeSceneImage(img.getWidth(),
                                          img.getHeight(),
                                          [],
                                          true,
                                          colorDb.get("transparent"));
      newScene = newScene.add(img, img.getWidth()/2, img.getHeight()/2);
      var leftMost = Math.min(x1,x2);
      var topMost = Math.min(y1,y2);
      return makeImage(newScene.add(line, line.getWidth()/2+leftMost, line.getHeight()/2+topMost));
    });

    f("square", function(maybeSide, maybeMode, maybeColor) {
      checkArity(3, arguments, "square", false);
      c3("square", maybeSide, annNumNonNegative, maybeMode, annMode, maybeColor, annColor);
      var side = jsnums.toFixnum(maybeSide);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(image.makeSquareImage(side, mode, color));
    });

    f("rectangle", function(maybeWidth, maybeHeight, maybeMode, maybeColor) {
      checkArity(4, arguments, "rectangle", false);
      c("square",
        maybeWidth, annNumNonNegative,
        maybeHeight, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeRectangleImage(width, height, mode, color));
    });

    f("regular-polygon", function(maybeLength, maybeCount, maybeMode, maybeColor) {
      checkArity(4, arguments, "regular-polygon", false);
      c("regular-polygon",
        maybeLength, annNumNonNegative,
        maybeCount, annSideCount,
        maybeMode, annMode,
        maybeColor, annColor);
      var length = jsnums.toFixnum(maybeLength);
      var count = jsnums.toFixnum(maybeCount);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makePolygonImage(length, count, 1, mode, color));
    });

    f("ellipse", function(maybeWidth, maybeHeight, maybeMode, maybeColor) {
      checkArity(4, arguments, "ellipse", false);
      c("ellipse",
        maybeWidth, annNumNonNegative,
        maybeHeight, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeEllipseImage(width, height, mode, color));
    });

    f("wedge", function(maybeRadius, maybeAngle, maybeMode, maybeColor) {
      checkArity(4, arguments, "wedge", false);
      c("wedge",
        maybeRadius, annNumNonNegative,
        maybeAngle, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var radius = jsnums.toFixnum(maybeRadius);
      var angle = jsnums.toFixnum(maybeAngle);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
          image.makeWedgeImage(radius, angle, mode, color)
        );
    });

    f("triangle", function(maybeSide, maybeMode, maybeColor) {
      checkArity(3, arguments, "triangle", false);
      c3("triangle", maybeSide, annNumNonNegative, maybeMode, annMode, maybeColor, annColor);
      var side = jsnums.toFixnum(maybeSide);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        // Angle makes triangle point up
        image.makeTriangleImage(side, 360-60, side, mode, color));
    });

    f("triangle-sas", function(maybeSideA, maybeAngleB, maybeSideC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-sas", false);
      c("triangle-sas",
        maybeSideA, annNumNonNegative,
        maybeAngleB, annAngle,
        maybeSideC, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var sideA = jsnums.toFixnum(maybeSideA);
      var angleB = jsnums.toFixnum(maybeAngleB);
      var sideC = jsnums.toFixnum(maybeSideC);

      var sideB2 = cosRel(sideA, sideC, angleB);
      var sideB  = Math.sqrt(sideB2);

      if (sideB2 <= 0) {
        throwMessage("The given side, angle and side will not form a triangle: "
                     + maybeSideA + ", " + maybeAngleB + ", " + maybeSideC);
      } else {
        if (less(sideA + sideC, sideB) ||
            less(sideB + sideC, sideA) ||
            less(sideA + sideB, sideC)) {
          throwMessage("The given side, angle and side will not form a triangle: "
                       + maybeSideA + ", " + maybeAngleB + ", " + maybeSideC);
        } else {
          if (less(sideA + sideC, sideB) ||
              less(sideB + sideC, sideA) ||
              less(sideA + sideB, sideC)) {
            throwMessage("The given side, angle and side will not form a triangle: "
                         + maybeSideA + ", " + maybeAngleB + ", " + maybeSideC);
          }
        }
      }

      var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);

      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-sss", function(maybeSideA, maybeSideB, maybeSideC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-sss", false);
      c("triangle-sss",
        maybeSideA, annNumNonNegative,
        maybeSideB, annNumNonNegative,
        maybeSideC, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var sideA = jsnums.toFixnum(maybeSideA);
      var sideB = jsnums.toFixnum(maybeSideB);
      var sideC = jsnums.toFixnum(maybeSideC);
      if (less(sideA + sideB, sideC) ||
          less(sideC + sideB, sideA) ||
          less(sideA + sideC, sideB)) {
        throwMessage("The given sides will not form a triangle: "
                     + maybeSideA + ", " + maybeSideB + ", " + maybeSideC);
      }

      var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);

      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-ass", function(maybeAngleA, maybeSideB, maybeSideC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-ass", false);
      c("triangle-ass",
        maybeAngleA, annAngle,
        maybeSideB, annNumNonNegative,
        maybeSideC, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var angleA = jsnums.toFixnum(maybeAngleA);
      var sideB = jsnums.toFixnum(maybeSideB);
      var sideC = jsnums.toFixnum(maybeSideC);
      if (less(180, angleA)) {
        throwMessage("The given angle, side and side will not form a triangle: "
                     + maybeAngleA + ", " + maybeSideB + ", " + maybeSideC);
      }
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-ssa", function(maybeSideA, maybeSideB, maybeAngleC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-ssa", false);
      c("triangle-ssa",
        maybeSideA, annNumNonNegative,
        maybeSideB, annNumNonNegative,
        maybeAngleC, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var sideA  = jsnums.toFixnum(maybeSideA);
      var sideB  = jsnums.toFixnum(maybeSideB);
      var angleC = jsnums.toFixnum(maybeAngleC);
      if (less(180, angleC)) {
        throwMessage("The given side, side and angle will not form a triangle: "
                     + sideA + ", " + sideB + ", " + angleC);
      }
      var sideC2 = cosRel(sideA, sideB, angleC);
      var sideC  = Math.sqrt(sideC2);

      if (sideC2 <= 0) {
        throwMessage("The given side, side and angle will not form a triangle: "
                     + maybeSideA + ", " + maybeSideB + ", " + maybeAngleC);
      } else {
        if (less(sideA + sideB, sideC) ||
            less(sideC + sideB, sideA) ||
            less(sideA + sideC, sideB)) {
          throwMessage("The given side, side and angle will not form a triangle: "
                       + maybeSideA + ", " + maybeSideB + ", " + maybeAngleC);
        }
      }

      var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);

      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-aas", function(maybeAngleA, maybeAngleB, maybeSideC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-aas", false);
      c("triangle-aas",
        maybeAngleA, annAngle,
        maybeAngleB, annAngle,
        maybeSideC, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var angleA = jsnums.toFixnum(maybeAngleA);
      var angleB = jsnums.toFixnum(maybeAngleB);
      var sideC = jsnums.toFixnum(maybeSideC);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      var angleC = (180 - angleA - angleB);
      if (less(angleC, 0)) {
        throwMessage("The given angle, angle and side will not form a triangle: "
                     + maybeAngleA + ", " + maybeAngleB + ", " + maybeSideC);
      }
      var hypotenuse = sideC / (Math.sin(angleC*Math.PI/180))
      var sideB = hypotenuse * Math.sin(angleB*Math.PI/180);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-asa", function(maybeAngleA, maybeSideB, maybeAngleC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-asa", false);
      c("triangle-asa",
        maybeAngleA, annAngle,
        maybeSideB, annNumNonNegative,
        maybeAngleC, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var angleA = jsnums.toFixnum(maybeAngleA);
      var sideB = jsnums.toFixnum(maybeSideB);
      var angleC = jsnums.toFixnum(maybeAngleC);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      var angleB = 180 - angleA - angleC;
      if (less(angleB, 0)) {
        throwMessage("The given angle, side and angle will not form a triangle: "
                     + maybeAngleA + ", " + maybeSideB + ", " + maybeAngleC);
      }
      var base = (sideB * Math.sin(angleA*Math.PI/180)) / (Math.sin(angleB*Math.PI/180));
      var sideC = (sideB * Math.sin(angleC*Math.PI/180)) / (Math.sin(angleB*Math.PI/180));
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("triangle-saa", function(maybeSideA, maybeAngleB, maybeAngleC, maybeMode, maybeColor) {
      checkArity(5, arguments, "triangle-saa", false);
      c("triangle-saa",
        maybeSideA, annNumNonNegative,
        maybeAngleB, annAngle,
        maybeAngleC, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var sideA = jsnums.toFixnum(maybeSideA);
      var angleB = jsnums.toFixnum(maybeAngleB);
      var angleC = jsnums.toFixnum(maybeAngleC);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      var angleA = (180 - angleC - angleB);
      var hypotenuse = sideA / (Math.sin(angleA*Math.PI/180));
      var sideC = hypotenuse * Math.sin(angleC*Math.PI/180);
      var sideB = hypotenuse * Math.sin(angleB*Math.PI/180);
      return makeImage(
        image.makeTriangleImage(sideC, angleA, sideB, mode, color));
    });

    f("right-triangle", function(maybeSide1, maybeSide2, maybeMode, maybeColor) {
      checkArity(4, arguments, "right-triangle", false);
      c("right-triangle",
        maybeSide1, annNumNonNegative,
        maybeSide2, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var side1 = jsnums.toFixnum(maybeSide1);
      var side2 = jsnums.toFixnum(maybeSide2);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        // add 180 to make the triangle point up
        image.makeTriangleImage(side1, 360 - 90, side2, mode, color));
    });

    f("isosceles-triangle", function(maybeSide, maybeAngleC, maybeMode, maybeColor) {
      checkArity(4, arguments, "isosceles-triangle", false);
      c("isosceles-triangle",
        maybeSide, annNumNonNegative,
        maybeAngleC, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var side = jsnums.toFixnum(maybeSide);
      var angleC = jsnums.toFixnum(maybeAngleC);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      var angleAB = (180-angleC)/2;
      var base = 2*side*Math.sin((angleC*Math.PI/180)/2);
      return makeImage(
        // add 180 to make the triangle point up
        image.makeTriangleImage(base, 360 - angleAB, side, mode, color));
    });

    f("star", function(maybeSide, maybeMode, maybeColor) {
      checkArity(3, arguments, "star", false);
      c3("star", maybeSide, annNumNonNegative, maybeMode, annMode, maybeColor, annColor);
      var side = jsnums.toFixnum(maybeSide);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makePolygonImage(side, 5, 2, mode, color));
    });
    // TODO: This was split from the variable-arity case in the original whalesong "star" function
    f("star-sized", function(maybePointCount, maybeOuter, maybeInner, maybeMode, maybeColor) {
      checkArity(5, arguments, "star-sized", false);
      c("star-sized",
        maybePointCount, annPointCount,
        maybeOuter, annNumNonNegative,
        maybeInner, annNumNonNegative,
        maybeMode, annMode,
        maybeColor, annColor);
      var pointCount = jsnums.toFixnum(maybePointCount);
      var outer = jsnums.toFixnum(maybeOuter);
      var inner = jsnums.toFixnum(maybeInner);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeStarImage(pointCount, inner, outer, mode, color));
    });
    // alias
    f("radial-star", values["star-sized"].app);

    f("star-polygon", function(maybeLength, maybeCount, maybeStep, maybeMode, maybeColor) {
      checkArity(5, arguments, "star-polygon", false);
      c("star-polygon",
        maybeLength, annNumNonNegative,
        maybeCount, annSideCount,
        maybeStep, annStepCount,
        maybeMode, annMode,
        maybeColor, annColor);
      var length = jsnums.toFixnum(maybeLength);
      var count = jsnums.toFixnum(maybeCount);
      var step = jsnums.toFixnum(maybeStep);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makePolygonImage(length, count, step, mode, color));
    });

    f("rhombus", function(maybeLength, maybeAngle, maybeMode, maybeColor) {
      checkArity(4, arguments, "rhombus", false);
      c("rhombus",
        maybeLength, annNumNonNegative,
        maybeAngle, annAngle,
        maybeMode, annMode,
        maybeColor, annColor);
      var length = jsnums.toFixnum(maybeLength);
      var angle = jsnums.toFixnum(maybeAngle);
      var mode = unwrapMode(maybeMode);
      var color = unwrapColor(maybeColor);
      return makeImage(
        image.makeRhombusImage(length, angle, mode, color));
    });

    f("image-to-color-list", function(maybeImage) {
      checkArity(1, arguments, "image-to-color-list", false);
      c1("image-width", maybeImage, annImage);
      var img = unwrapImage(maybeImage);
      return image.imageToColorList(img);
    });

    f("color-list-to-image", function(maybeList, maybeWidth, maybeHeight, maybePinholeX, maybePinholeY) {
      checkArity(5, arguments, "color-list-to-image", false);
      c3("color-list-to-image",
         maybeList, annListColor,
         maybeWidth, annNatural,
         maybeHeight, annNatural,
         maybePinholeX, annNatural,
         maybePinholeY, annNatural);
      var len = ffi.listLength(maybeList);
      var loc = unwrapListofColor(maybeList);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      if (len != width * height) {
        throwMessage("The color list does not have the right number of elements: " +
                     "expected " + (width * height) + " but got " + len);
      }
      var pinholeX = jsnums.toFixnum(maybePinholeX);
      var pinholeY = jsnums.toFixnum(maybePinholeY);
      return makeImage(image.colorListToImage(loc, width, height, pinholeX, pinholeY));
    });

    f("color-list-to-bitmap", function(maybeList, maybeWidth, maybeHeight) {
      checkArity(3, arguments, "color-list-to-bitmap", false);
      c3("color-list-to-bitmap",
         maybeList, annListColor,
         maybeWidth, annNatural,
         maybeHeight, annNatural);
      var len = ffi.listLength(maybeList);
      var loc = unwrapListofColor(maybeList);
      var width = jsnums.toFixnum(maybeWidth);
      var height = jsnums.toFixnum(maybeHeight);
      if (len != width * height) {
        throwMessage("The color list does not have the right number of elements: " +
                     "expected " + (width * height) + " but got " + len);
      }
      return makeImage(image.colorListToImage(loc, width, height, width / 2, height / 2));
    });

    f("image-width", function(maybeImg) {
      checkArity(1, arguments, "image-width", false);
      c1("image-width", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return runtime.wrap(img.getWidth());
    });

    f("image-height", function(maybeImg) {
      checkArity(1, arguments, "image-height", false);
      c1("image-height", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return runtime.wrap(img.getHeight());
    });

    f("image-baseline", function(maybeImg) {
      checkArity(1, arguments, "image-baseline", false);
      c1("image-baseline", maybeImg, annImage);
      var img = unwrapImage(maybeImg);
      return runtime.wrap(img.getBaseline());
    });

    f("name-to-color", function(maybeName) {
      checkArity(1, arguments, "name-to-color", false);
      c1("name-to-color", maybeName, runtime.String);
      var name = checkString(maybeName);
      return runtime.wrap(colorDb.get(String(name)) || false);
    });

    values["empty-image"] = runtime.makeOpaque(image.makeSceneImage(0, 0, [], true, colorDb.get("transparent")));
    return runtime.makeModuleReturn(values, {
        "Image": runtime.makePrimitiveAnn("Image", checkImagePred),
        "Scene": runtime.makePrimitiveAnn("Scene", checkScenePred)
      });
  }
})