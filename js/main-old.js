document.addEventListener("DOMContentLoaded", function(event) {
    init();
    tracksInit();
    controlsInit();
});

var app = {
  
}

function tracksInit(){
    $('.track').rangeSlider({
          arrows: false,
          valueLabels:"hide",
          bounds: {min: 10, max: 90},
          defaultValues:{min: 10, max: 50},
          range: {min: 11, max: 100},
          wheelMode: "scroll",
          wheelSpeed: 30,
          scales: [
            // Primary scale
            {
              first: function(val){ return val; },
              next: function(val){ return val + 10; },
              stop: function(val){ return false; },
              label: function(val){ return val; },
              format: function(tickContainer, tickStart, tickEnd){ 
                tickContainer.addClass("myCustomClass");
              }
            },
            // Secondary scale
            {
              first: function(val){ return val; },
              next: function(val){
                if (val % 10 === 9){
                  return val + 2;
                }
                return val + 1;
              },
              stop: function(val){ return false; },
              label: function(){ return null; }
            }]
    }).draggable({ 
      axis: 'x',
      containment: '#track-container'
    }).bind('valuesChanging', function(e, data){
      console.log('Something moved. min: ' + data.values.min + ' max: ' + data.values.max);
      $(this).find('.value-min').text(data.values.min.toFixed(2));
      $(this).find('.value-max').text(data.values.max.toFixed(2));
    })
    //$('.track').trigger('valuesChanging');
    $('.track .ui-rangeSlider-bar').append('<div class="value-min"></div><div class="value-max"></div>')

    $('#track-container').sortable({ containment: '#track-container' });
}
function controlsInit(){
  $('#play').click(function(){
    document.getElementById('video').play();
  });
  $('#pause').click(function(){
    document.getElementById('video').pause();
  });
  $('#add-video').click(function(){
    document.getElementById('video').pause();
  });
}

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
function init(){
    document.getElementById('loadfile').addEventListener('change', function(e){
        document.getElementById('video').setAttribute('src', 'video/' + this.value.split('\\').pop());
    }, false);

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
          offsets[i] += inertias[i];
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
