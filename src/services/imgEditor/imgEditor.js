import Util from './utils'
import addText from './addText'
import addRotate from './addRotate'
import addDrawing from './addDrawing'
import uiid from '../../utils/uiid'
import Plugin from './plugin'
import Transformation from './transformation'
import { Toolbar, ButtonGroup, Button } from './toolbar'

//定义一个图片编辑器的对象
function ImgEditor(ele, options, plugins) {
    return this.constructor(ele, options, plugins);
}

//定义图片编辑器的插件
ImgEditor.plugins = [];

ImgEditor.prototype = {
    containerElement: null,
    canvas: null,
    plugins:　{},
    // This options are a merge between `defaults` and the options passed
    // through the constructor
    options: {},
    // Reference to the Fabric image object
    image: null,
    // Reference to the Fabric source canvas object
    sourceCanvas: null,
    // Reference to the Fabric source image object
    sourceImage: null,
    // Track of the original image element
    originalImageElement: null,
      // Stack of transformations to apply to the image source
    transformations: [],
    defaults: {
        minWidth: null,
        minHeight: null,
        maxWidth: null,
        maxHeight: null,
        ratio: null,
        background: '#fff'
    },
    constructor: function(ele, options, plugins) {
        this.options = Util.extend(options, this.defaults)
        if (typeof ele === 'string') {
            ele = document.querySelector(ele);
        }
        if (null === ele) {
            return;
        }
        var image = new Image();
        image.onload = function() {
            this._initializeDOM(ele);
            this._initializeImage();
            this.initTransformation();
            this._initializePlugins(this.plugins);
            this.initPlugins();
            // Then initialize the plugins
            this.refresh(function() {
                // Execute a custom callback after initialization
                this.options.initialize.bind(this).call();
            }.bind(this));
        }.bind(this);
        image.src = ele.src;
    },
    _initializeDOM: function(imageElement) {
        // 创建 canvas 的 Container
        var mainContainerElement = document.createElement('div');
        mainContainerElement.className = 'darkroom-container';
    
        // 创建 canvas 的操作button -》 Toolbar
        var toolbarElement = document.createElement('div');
        toolbarElement.className = 'darkroom-toolbar';
        mainContainerElement.appendChild(toolbarElement);
    
        // 创建 canvas 窗口 Viewport canvas
        var canvasContainerElement = document.createElement('div');
        canvasContainerElement.className = 'darkroom-image-container';
        var canvasElement = document.createElement('canvas');
        canvasContainerElement.appendChild(canvasElement);
        mainContainerElement.appendChild(canvasContainerElement);
    
        // Source canvas
        var sourceCanvasContainerElement = document.createElement('div');
        sourceCanvasContainerElement.className = 'darkroom-source-container';
        sourceCanvasContainerElement.style.display = 'none';
        var sourceCanvasElement = document.createElement('canvas');
        sourceCanvasContainerElement.appendChild(sourceCanvasElement);
        mainContainerElement.appendChild(sourceCanvasContainerElement);
    
        // Original image
        imageElement.parentNode.replaceChild(mainContainerElement, imageElement);
        imageElement.style.display = 'none';
        mainContainerElement.appendChild(imageElement);
    
        // Instanciate object from elements
        this.containerElement = mainContainerElement;
        this.originalImageElement = imageElement;
    
        this.toolbar = new Toolbar(toolbarElement);
        // console.log(imageElement.width, imageElement.height)
        // var canvasHeight = imageElement.width > 500
        this.canvas = new fabric.Canvas(canvasElement, {
            width: 400,
            height: 300,
            hasRotatingPoint: true,
            centerTransform: true,
            selection: false,
            backgroundColor: this.options.backgroundColor
        });
        this.sourceCanvas = new fabric.Canvas(sourceCanvasElement, {
            selection: false,
            backgroundColor: this.options.backgroundColor
        });
    },
    _initializeImage: function() {
        this.sourceImage = new fabric.Image(this.originalImageElement, {
            // Some options to make the image static
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            hasControls: false,
            hasBorders: false
        });

        this.sourceCanvas.add(this.sourceImage);

        // Adjust width or height according to specified ratio
        var viewport = Util.computeImageViewPort(this.sourceImage);
        var canvasWidth = viewport.width;
        var canvasHeight = viewport.height;
        this.sourceCanvas.setWidth(canvasWidth);
        this.sourceCanvas.setHeight(canvasHeight);
        this.canvas.centerObject(this.sourceImage);
        this.sourceImage.setCoords();
    },
    // Initialize every plugins.
    // Note that plugins are instanciated in the same order than they
    // are declared in the parameter object.
    _initializePlugins: function(plugins) {
        for (var name in plugins) {
            var plugin = plugins[name];
            var options = this.options.plugins[name];
            // Setting false into the plugin options will disable the plugin
            if (options === false)
            continue;
            // Avoid any issues with _proto_
            if (!plugins.hasOwnProperty(name))
            continue;
            this.plugins[name] = new plugin(this, options);
        }
    },
    initTransformation: function() {
        addText(this);  
        addDrawing(this)
        addRotate(this);
    },
    initPlugins: function() {
        console.log(this)
    },
    // Adjust image & canvas dimension according to min/max width/height
    // and ratio specified in the options.
    // This method should be called after each image transformation.
    refresh: function(next) {
        var clone = new Image();
        clone.onload = function() {
            this._replaceCurrentImage(new fabric.Image(clone));
            if (next) next();
        }.bind(this);
        clone.src = this.sourceImage.toDataURL();
    },
    _replaceCurrentImage: function(newImage) {
        if (this.image) {
            this.image.remove();
        }
        this.image = newImage;
        this.image.selectable = false;
        
        // Adjust width or height according to specified ratio
        var viewport = Util.computeImageViewPort(this.image);
        var canvasWidth = viewport.width;
        var canvasHeight = viewport.height;

        if (null !== this.options.ratio) {
            var canvasRatio = +this.options.ratio;
            var currentRatio = canvasWidth / canvasHeight;

            if (currentRatio > canvasRatio) {
                canvasHeight = canvasWidth / canvasRatio;
            } else if (currentRatio < canvasRatio) {
                canvasWidth = canvasHeight * canvasRatio;
            }
        }
        // Then scale the image to fit into dimension limits
        var scaleMin = 1;
        var scaleMax = 1;
        var scaleX = 1;
        var scaleY = 1;

        if (null !== this.options.maxWidth && this.options.maxWidth < canvasWidth) {
            scaleX =  this.options.maxWidth / canvasWidth;
        }
        if (null !== this.options.maxHeight && this.options.maxHeight < canvasHeight) {
            scaleY =  this.options.maxHeight / canvasHeight;
        }
        scaleMin = Math.min(scaleX, scaleY);

        scaleX = 1;
        scaleY = 1;
        if (null !== this.options.minWidth && this.options.minWidth > canvasWidth) {
            scaleX =  this.options.minWidth / canvasWidth;
        }
        if (null !== this.options.minHeight && this.options.minHeight > canvasHeight) {
            scaleY =  this.options.minHeight / canvasHeight;
        }
        scaleMax = Math.max(scaleX, scaleY);

        var scale = scaleMax * scaleMin; // one should be equals to 1

        canvasWidth *= scale;
        canvasHeight *= scale;

        // Finally place the image in the center of the canvas
        this.image.setScaleX(1 * scale);
        this.image.setScaleY(1 * scale);
        this.canvas.add(this.image);
        this.canvas.setWidth(this.image.width * 1 * scale);
        this.canvas.setHeight(this.image.height * 1 * scale);
        this.canvas.centerObject(this.image);
        this.image.setCoords();
        console.log(this.image)
        debugger
    },

    applyTransformation: function(transformation) {
        this.transformations.push(transformation);
        transformation.applyTransformation(
            this.sourceCanvas,
            this.sourceImage,
            this._postTransformation.bind(this)
        );
    },
    _postTransformation: function(newImage) {
        console.log(newImage)
        if (newImage)
            this.sourceImage = newImage;
        this.refresh(function() {
            this.dispatchEvent('core:transformation');
        }.bind(this));
    },
    dispatchEvent: function(eventName) {
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        this.canvas.getElement().dispatchEvent(event);
    },

}
// export default ImgEditor;
export {
    ImgEditor,
    addText
}