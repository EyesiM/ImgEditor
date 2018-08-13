import Transformation from './transformation'
import Plugin from './plugin'
export default function addText(canvas) {
    // var TextRoom = Transformation.extend({
    //     applyTransformation: function(canvas, image, next) {
    //         console.log(canvas, image, next)
    //     }
    // });
    canvas.plugins['txt'] = Plugin.extend({
        initialize: function InitDarkroomCirclePlugin() {
            var buttonGroup = canvas.toolbar.createButtonGroup();
            var txtButton = buttonGroup.createButton({
                image: 'text'
            });
            txtButton.addEventListener('click', this.addTxt.bind(canvas));
        },
        addTxt: function (content) {
            console.log(content, 1)
            this.canvas.isDrawingMode = false;
            var textSample = new fabric.Textbox('测试测试测试', {
                fontSize: 20,
                left: 100,
                top: 100,
                fontFamily: 'helvetica',
                angle: 1,
                fill: '#f00',
                fontWeight: '',
                originX: 'left',
                width: 200,
                hasRotatingPoint: true,
                centerTransform: true
            });
            console.log(this)
            this.canvas.add(textSample);
            // this.canvas.applyTransformation(
            //     new TextRoom()
            // );
        }
    });
    console.log(canvas.plugins)
} 