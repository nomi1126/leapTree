$(function(){

    var $imgArea  = $(".js_imgArea"),
        canvas    = $("#canvas")[0],
        ctx       = canvas.getContext("2d"),
        winWidth  = window.innerWidth,
        winHeight = window.innerHeight;

    var getRandomNum = function(maxNum){
        return Math.floor(Math.random()*maxNum+1);
    };

    var changeOrder = function(array){
        var orderedArray = [];

        for (var i = 0, len1 = array.length; i < len1; i++) {
            var _array = array[i],
                isPush = true;

            for (var k = 0, len2 = orderedArray.length; k < len2; k++) {
                if (orderedArray[k].x > _array.x) {
                    orderedArray.unshift(_array);
                    isPush = false;
                    break;
                }
            }
            if (isPush) orderedArray.push(_array);
        }

        return orderedArray;
    };

    var draw = function(_fingerPositionsArray){

        var orderedArray = changeOrder(_fingerPositionsArray),
            offset       = 80,
            _negativeOffset = 0;

        // ctx.clearRect(0, 0, winWidth, winHeight);
        //ctx.fillStyle = "rgba(255,255,255,0.2)";
        // ctx.fillRect(0, 0, winWidth, winHeight);
        ctx.fillStyle = "rgba(" + getRandomNum(255) + "," + getRandomNum(255) + "," + getRandomNum(255) + ",0.5)";

        for (var i = 0, len = orderedArray.length; i < len; i++) {

            var _pos    = orderedArray[i],
                _radius = _pos.z > 100 ? 10 : _pos.z/10;

            if (_radius < 0) _radius = 5;

            if (len > 1 && len % 2 == 0) _negativeOffset = parseInt((len-1)/2) * offset + offset/2 + parseInt(len/2)*_radius;
            else if (len > 1 && len % 2 != 0) _negativeOffset = parseInt((len-1)/2) * offset + parseInt(len/2)*_radius + _radius/2;

            var _drawPos_x = winWidth/2 + _pos.x - _radius/2 + (offset+_radius)*i - _negativeOffset,
                _drawPos_y = winHeight - winHeight/4 + (_pos.y*-1);

            ctx.beginPath();
            ctx.arc(_drawPos_x, _drawPos_y, _radius, 0, Math.PI*2, false);
            ctx.fill();

        }

    };

    var update = function(frame){

        var _genstureType = frame.gestures[0] ? frame.gestures[0].type : null,
            _fingerPositionsArray = [];

        for (var i = 0, len = frame.fingers.length; i < len; i++) {
            var _fingerObj = {};

            _fingerObj.x = frame.fingers[i].tipPosition[0];
            _fingerObj.y = frame.fingers[i].tipPosition[1];
            _fingerObj.z = frame.fingers[i].tipPosition[2];

            _fingerPositionsArray.push(_fingerObj);
        }

        // if (_genstureType == "keyTap") draw(_fingerPositionsArray);
        draw(_fingerPositionsArray);

    };

    var setup = function(){

        $imgArea.css({
            "width" : winWidth + "px",
            "height" : winHeight + "px"
        });

        canvas.width  = winWidth;
        canvas.height = winHeight;

        Leap.loop({enableGestures : true}, function(frame){
            // for (var i = 0, len = frame.gestures.length; i < len; i++) {
            //     var _gesture = frame.gestures[i];
            //     console.log(_gesture);
            // }
            update(frame);
        });

    };

    setup();

});