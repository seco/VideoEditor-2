document.addEventListener("DOMContentLoaded", function(event) {
    TimeLine.init();
    //tracksInit();
    //controlsInit();
});

var TimeLine = {
    /* Default API */
    Track/*(source: file)*/: {
        get offset(){ return 'offset:Number'; },
        set offset(timeInSeconds /*number*/){ return 'set'; },
        get duration(){ return 'duration:Number'; },
        set duration(timeOnSeconds /*Number*/){ return 'duration'; }
    },
    get tracks(){ return 'Track[]' },
    addTrack1: function(track){ },
    removeTrack: function(track){ },
    position1: 5,
    get position(){ return this.position1; },
    set position(timeInSeconds /*Number*/){ this.position1 = timeInSeconds },

    play: function(){ },
    pause: function(){ },

    get volume(){ return 'volume'},
    set volume(level /*: Number /*0..1*/){ console.log('set volume')},
    /*-------------------*/
    init: function(){
        //TimeLine.tracksInit();

        $('#play').click(function(){
            document.getElementById('video').play();
        });
        $('#pause').click(function(){
            document.getElementById('video').pause();
        });
        $('#add-video').click(function(){
            
        });

        $('#track-list').sortable({ containment: '#track-list' });

        document.getElementById('file').addEventListener('change',  function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

            // Loop through the FileList and render image files as thumbnails.
            for (var i = 0, f; f = files[i]; i++) {
                console.log(f)
                TimeLine.addTrack(f);
                // Only process video files.
                if (!f.type.match('video.*')) continue;

                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        // Render thumbnail.
                        var span = document.createElement('span');
                        span.innerHTML = ['<video class="video-source" src="', e.target.result,
                                        '" title="', escape(theFile.name), '"<video/>'].join('');
                        document.getElementById('list').insertBefore(span, null);
                    };
                })(f);

                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
            }
        }, false);

        init();
        function init(){
            var draw_interval = null;
            var ctx_copy = null;
            var ctx_draw = null;

            var offsets = [];
            var inertias = [];
            var slices = 4;
            var out_padding = 100;
            var interval = null;

            var inertia = -2.0;

            var output = [];
            var canvas_draw;

            var video_dom = document.querySelector('#video');
            var canvas_copy = document.querySelector('#canvas-copy-fancy');
            canvas_draw = document.querySelector('#canvas-draw-fancy');

            video_dom.addEventListener('canplay', function() {
                canvas_copy.width = canvas_draw.width = video_dom.videoWidth;
                canvas_copy.height = video_dom.videoHeight;
                canvas_draw.height = video_dom.videoHeight + out_padding;
                ctx_copy = canvas_copy.getContext('2d');
                ctx_draw = canvas_draw.getContext('2d');
            }, false);


            for (var i = 0; i < slices; i++) {
                offsets[i] = 0;
                inertias[i] = inertia;
                inertia += 0.4;
            }

            video_dom.addEventListener('play', function() {
                processEffectFrame();
                if (interval == null) {
                    interval = window.setInterval(function() { 
                        processEffectFrame();
                        //output.push(canvas_draw.toDataURL('image/png'));
                    }, 33);
                }        
            }, false);

            function processEffectFrame() {
                var slice_width = video_dom.videoWidth / slices;
                ctx_copy.drawImage(video_dom, 0 ,0);
                ctx_draw.clearRect(0, 0,  canvas_draw.width, canvas_draw.height);
                for (var i = 0; i < slices; i++) {
                    var sx = i * slice_width;
                    var sy = 0;
                    var sw = slice_width;
                    var sh = video_dom.videoHeight;
                    var dx = sx;
                    var dy = offsets[i] + sy + out_padding;
                    var dw = sw;
                    var dh = sh;
                    ctx_draw.drawImage(canvas_copy, sx, sy, sw, sh, dx, dy, dw, dh);
                    if (Math.abs(offsets[i] + inertias[i]) < out_padding) {
                         inertias[i];
                    } else {
                        inertias[i] = -inertias[i];
                    }
                }
            };

            video_dom.addEventListener('pause', function() {
                window.clearInterval(interval);
                interval = null;
            }, false);

            video_dom.addEventListener('ended', function() {
                clearInterval(interval);
            }, false);
        }
    },
    addTrack: function(){
        var $track = $('<div class="track-block"><div class="track"></div><span id="track-info"></span></div>');
        $track.appendTo('#track-list');
        $('.track', $track).rangeSlider({
            arrows: false, valueLabels:'hide',
            bounds: { min: 10, max: 90 },
            defaultValues:{ min: 10, max: 50 },
            range: { min: 11, max: 100 },
            wheelMode: 'scroll', wheelSpeed: 30,
            scales: [
                { // Primary scale
                    first: function(val){ return val; },
                    next: function(val){ return val + 10; },
                    stop: function(val){ return false; },
                    label: function(val){ return val; },
                    format: function(tickContainer, tickStart, tickEnd){ 
                        tickContainer.addClass('myCustomClass');
                    }
                },
                { // Secondary scale
                    first: function(val){ return val; },
                    next: function(val){
                        if (val % 10 === 9){
                        return val + 2;
                        }
                        return val + 1;
                    },
                    stop: function(val){ return false; },
                    label: function(){ return null; }
                }
            ]
        }).draggable({ 
            axis: 'x',
            containment: '#track-list'
        }).bind('valuesChanging', function(e, data){
            $(this).find('.value-min').text(data.values.min.toFixed(2));
            $(this).find('.value-max').text(data.values.max.toFixed(2));
        });

        $('.track .ui-rangeSlider-bar', $track).append('<div class="value-min"></div><div class="value-max"></div>');
        $('#track-list').sortable('refresh');
    }
}