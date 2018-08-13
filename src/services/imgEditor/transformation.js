import Util from './utils'
function Transformation(options) {
    this.options = options;
}

Transformation.prototype = {
    applyTransformation: function(image) { 
        /* no-op */
        console.log(image)  
    }
}

// Inspired by Backbone.js extend capability.
Transformation.extend = function(protoProps) {
    var parent = this;
    var child;
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }
    console.log(protoProps)
    Util.extend(child, parent);
    var Surrogate = function() {
        this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    if (protoProps) {
        Util.extend(child.prototype, protoProps);
    }
    child.__super__ = parent.prototype;
    return child;
}
export default Transformation;