import Transformation from './transformation'
import Plugin from './plugin'
export default function addDrawing(canvas) {
    canvas.plugins['drawing'] = Plugin.extend({
        initialize: function InitDarkroomCirclePlugin() {
            var buttonGroup = canvas.toolbar.createButtonGroup();
            var txtButton = buttonGroup.createButton({
                image: 'drawing'
            });
            txtButton.addEventListener('click', this.addDraw.bind(canvas));
        },
        addDraw: function (content) {
            this.canvas.isDrawingMode = true;
        },
        removeDraw: function (content) {
            this.canvas.isDrawingMode = false;
        }
    });
    console.log(canvas.plugins)
} 