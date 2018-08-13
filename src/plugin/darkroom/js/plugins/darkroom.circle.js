(function() {
    'use strict';
    
    var CicleRoom = Darkroom.Transformation.extend({
        applyTransformation: function(canvas, image, next) {
            console.log(canvas, image, next)
            var sourceImage = image;
            
        }
    });
    Darkroom.plugins['circle'] = Darkroom.Plugin.extend({
        initialize: function InitDarkroomCirclePlugin() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();
            var squareButton = buttonGroup.createButton({
                image: 'square'
            });
            var circleButton = buttonGroup.createButton({
                image: 'circle'
            });
            var sureButton = buttonGroup.createButton({
                image: 'done',
                type: 'success'
            });
            squareButton.addEventListener('click', this.addCircle.bind(this, 'square'));
            circleButton.addEventListener('click', this.addCircle.bind(this, 'square'));
        },
        addCircle: function (type) {
            console.log(type, 1)
            this.darkroom.canvas.add(new fabric['Circle']({
                top: fabric.util.getRandomInt(0, 10),
                left: fabric.util.getRandomInt(0, 10),
                stroke: 'green',
                fill: 'transparent',
                width: 100,
                height: 100,
                radius: 100
            }));
            this.darkroom.applyTransformation(
                new CicleRoom()
            );
        }
    });
})();
