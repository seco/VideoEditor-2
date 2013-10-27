document.addEventListener("DOMContentLoaded", function(event) {
    TimeLine.init();
});

var TimeLine = {
    /* Default API */
    Track: function(file){

        if (!file.type.match('video.*')){
            console.warn('Only video files allowed');
            return;
        }

        var that = this;
        that.file = file;
        that.name = file.name;
        that.size = file.size;
        that.type = file.type;
    },
    tracksList: [],
    activeTrack: function(){ return TimeLine.tracks[0]; },
    getActiveTrack: function(){
        trackList.forEach(function(trk){
            /*trk.offset 
            Math.min.apply(null, [1,2,3])*/
        });
    },
    add: function(track){
        var reader = new FileReader();
        console.log(track);
        $('#loader').addClass('active');
        reader.onload = (function(theFile) {
            return function(e) {
                var $video = $('<video class="video-source" src="' + e.target.result + '" title="' + escape(theFile.name) + '"></video>');
                $video.appendTo('#files-list');

                var $track = $('<div class="track-block"><div class="track"></div><span class="remove-track"></span></div>');
                $track.append('<span class="track-info">'+ track.name +' | '+ (track.size/1000).toFixed(2)+'Kb'+'</span>')
                $track.appendTo('#track-list');
                track.elem = $track.get(0);
                track.videoDom = $video.get(0);

                track.videoDom.addEventListener('loadedmetadata', function(e){
                    var maxDuration = Math.round(track.videoDom.duration);
                    $('.track', $track).width(maxDuration);
                    $('.track', $track).rangeSlider({
                        arrows: false, valueLabels:'hide',
                        bounds: { min: 0, max: maxDuration },
                        defaultValues:{ min: 0, max: maxDuration },
                        wheelMode: 'scroll', wheelSpeed: 30
                    }).draggable({ 
                        axis: 'x',
                        containment: '#track-list'
                    }).bind('valuesChanging valuesChanged', function(e, data){
                        $(this).find('.value-min').text(Math.round(data.values.min));
                        $(this).find('.value-max').text(Math.round(data.values.max));
                    });

                    $('.track .ui-rangeSlider-bar', $track).append('<div class="value-min">0</div><div class="value-max">'+ maxDuration +'</div>');
                    $('.track', $track).append('<div class="dragger"></div>');
                    $('.remove-track', $track).click(function(){
                        TimeLine.remove(track);
                    });
                    $('#track-list').sortable('refresh');

                    TimeLine.tracksList.push(track);
                    if (TimeLine.tracksList.length>1) $('#time-pointer').height($('#time-pointer').height() + 55);
                    if (TimeLine.tracksList.length>0) $('#play, #pause').removeAttr('disabled');
                    $('#loader').removeClass('active');
                }, false);
            };
        })(track.file);

        reader.readAsDataURL(track.file);

        return track;
    },
    remove: function(track){
        if (TimeLine.tracksList.length>1) $('#time-pointer').height($('#time-pointer').height() - 55); 
        else $('#play, #pause').attr('disabled', 'disabled');

        var index = TimeLine.tracksList.indexOf(track);
        $(track.elem, track.videoDom).remove();
        TimeLine.tracksList.splice(index, 1);
    },
    get tracks(){ return this.tracksList; },
    timeLinePosition: 0,
    get position(){ return this.timeLinePosition; },
    set position(timeInSeconds){ 
        this.timeLinePosition = timeInSeconds; 
        if ( $('#timeLine').slider('value') != timeInSeconds ) $('#timeLine').slider('value', timeInSeconds);
    },
    playInterval: null,
    play: function(){
        if (!this.playInterval){
            $('#timeLine').slider('disable');
            var canvas_output = document.querySelector('#video-output'),
                videoDom = TimeLine.activeTrack().videoDom,
                ctx_output = canvas_output.getContext('2d');

            ctx_output.fillRect(0, 0, 800, 600)

            videoDom.addEventListener('play', function() {
                canvas_output.width = 800;//videoDom.videoWidth;
                canvas_output.height = 600;//videoDom.videoHeight;

                videoDom.currentTime = TimeLine.position;
                TimeLine.playInterval = setInterval(function(){
                    console.log('int')
                    ctx_output.drawImage(videoDom, 0 ,0, 800, 600);
                    TimeLine.position = TimeLine.position + 0.025;
                }, 25);
            });

            /*setInterval(function(){

            }, 1000);*/
            videoDom.play();

            /*videoDom.addEventListener('canplay', function() {
                ctx_output.width = videoDom.videoWidth;
                ctx_output = canvas_copy.getContext('2d');
            }, false);*/

        }
    },
    pause: function(){
        if (this.playInterval) {
            $('#timeLine').slider('enable');
            clearInterval(this.playInterval);
            this.playInterval = null;
            TimeLine.tracks[0].videoDom.pause();
        }
    },

    get volume(){ return 'volume'},
    set volume(level /*: Number /*0..1*/){ console.log('set volume')},
    /*-------------------*/
    init: function(){
        $('#play').click(function(){
            TimeLine.play();
        });
        $('#pause').click(function(){
            TimeLine.pause();
        });
        $('#add-video').click(function(){
            
        });

        $('#track-list').sortable({ containment: '#track-list' });
        $('#timeLine').slider({
            step: 0.025,
            min:0,
            max: 980,
            change: function(e, ui){ TimeLine.position = ui.value }
        }).find('.ui-slider-handle').append('<div id="time-pointer"></div>');

        document.getElementById('file').addEventListener('change',  function handleFileSelect(evt) {
            var file = evt.target.files[0]; // FileList object
            TimeLine.add(new TimeLine.Track(file));
        }, false);
    }
}

TimeLine.Track.prototype = {
    get offset(){ return parseInt( $('.track', this.elem).css('left') ); },
    set offset(timeInSeconds){ $('.track', this.elem).css('left', timeInSeconds); },
    get duration(){ return Math.round( $('.track', this.elem).rangeSlider('values').max ); },
    set duration(timeOnSeconds){ return $('.track', this.elem).rangeSlider('values', 0, timeOnSeconds )}
}