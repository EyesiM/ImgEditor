(function() {
    'use strict';

    var TextRoom = Darkroom.Transformation.extend({
        applyTransformation: function(canvas, image, next) {
            console.log(canvas, image, next)
        }
    });
    Darkroom.plugins['txt'] = Darkroom.Plugin.extend({
        initialize: function InitDarkroomCirclePlugin() {
            var buttonGroup = this.darkroom.toolbar.createButtonGroup();
            var txtButton = buttonGroup.createButton({
                image: 'text'
            });
            txtButton.addEventListener('click', this.addTxt.bind(this, 'txt'));
        },
        addTxt: function (content) {
            console.log(content, 1)
            this.darkroom.applyTransformation(
                new TextRoom()
            );
        }
    });
    
})();
    