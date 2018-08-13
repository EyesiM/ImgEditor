import { getUuid } from './utils/uiid'
import { ImgEditor, addText } from './services/imgEditor/imgEditor'

let uiid = getUuid(9, Math.ceil(Math.random()*52))
var preViewImg = document.getElementById('preViewImg');
var textAddBtn = document.getElementById('okBtn');
var saveBtn = document.getElementById('saveBtn');

// var c=document.getElementById("myCanvas");
// var ctx=c.getContext("2d");
// ctx.rotate(20*Math.PI/180);
// ctx.fillRect(50,20,100,50);
// // var data = ctx.toDataURL({ multiplier: 3, format: 'png' });
// console.log(ctx)
// document.getElementById('canvasRasterizer').src = ctx.canvas.toDataURL("image/png");;

preViewImg.onclick = function(e) {
    if (e.target.tagName === 'IMG') {    
        e.target.style = ''
        var targetId = ''    
        if (e.target.id) {
            targetId = '#' + e.target.id;
        } else {
            e.target.id = uiid
            targetId = '#' + uiid;
        }
        // console.log(targetId)
        // var $ = function(id){return document.getElementById(id)};
        // var canvas = this.__canvas = new fabric.Canvas('c', {
        //     isDrawingMode: true
        // });
        // console.log(canvas)
        var imgTarget = document.querySelector(targetId);
        var canvasWidth = imgTarget.width;
        var canvasHeight = imgTarget.height;
        // if ( canvasWidth / canvasHeight < this.canvas.width / this.canvas.height ) {
        //     canvasHeight = this.canvas.height;
        //     canvasWidth = this.canvas.height / canvasHeight * canvasWidth
        // } else {
        //     canvasWidth = this.canvas.width;
        //     canvasHeight = this.canvas.width / canvasWidth * canvasHeight
        // }
        console.log(canvasWidth, canvasHeight)
        var imgEditor = new ImgEditor(targetId, {
            // Size options
            minWidth: 100,
            minHeight: 100,
            maxWidth: 600,
            maxHeight: 500,
            ratio: 4/3,
            // backgroundColor: 'transparent',
            backgroundColor: '#000',

            // Plugins options
            plugins: {
                // save: true,
                crop: {
                    quickCropKey: 67, //key "c"
                    //minHeight: 50,
                    //minWidth: 50,
                    //ratio: 4/3
                }
            },

            // Post initialize script
            initialize: function() {
                // var cropPlugin = this.plugins['crop'];
                // // cropPlugin.selectZone(170, 25, 300, 300);
                // cropPlugin.requireFocus();
                console.log('intialiaze')
            }
        });
        console.log(imgEditor)
        textAddBtn.onclick = function() {
            addText(imgEditor.canvas);
        }
        saveBtn.onclick = function() {
            var data = imgEditor.canvas.toDataURL({ multiplier: 3, format: 'png' });
            document.getElementById('canvasRasterizer').src = data;
        }
        // let imgDarkroom = new Darkroom(targetId, {
        //     // Size options
        //     minWidth: 100,
        //     minHeight: 100,
        //     maxWidth: 600,
        //     maxHeight: 500,
        //     ratio: 4/3,
        //     backgroundColor: 'transparent',

        //     // Plugins options
        //     plugins: {
        //         // save: true,
        //         crop: {
        //             quickCropKey: 67, //key "c"
        //             //minHeight: 50,
        //             //minWidth: 50,
        //             //ratio: 4/3
        //         }
        //     },

        //     // Post initialize script
        //     initialize: function() {
        //         var cropPlugin = this.plugins['crop'];
        //         // cropPlugin.selectZone(170, 25, 300, 300);
        //         cropPlugin.requireFocus();
        //     }
        // });
        // document.getElementById('okBtn').onclick = function() {
        //     console.log(imgDarkroom.canvas, imgDarkroom.sourceImage, imgDarkroom.sourceImage)
        //     // console.log(container)
        //     // var image = new Image();
        //     // image.onload = function() {
        //     //   container.parentNode.replaceChild(image, container);
        //     // }
        
        //     // image.src = this.sourceImage.toDataURL();
        //     var data = imgDarkroom.canvas.toDataURL({ multiplier: 3, format: 'png' });
        //     document.getElementById('canvasRasterizer').src = data;
        // }
    }
}