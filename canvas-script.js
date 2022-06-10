class CanvasBehavior{

    static getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();
    
        var body = document.body;
        var docEl = document.documentElement;
    
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
    
        return { top: Math.round(top), left: Math.round(left) };
    }

    canvas_arrow(fromx, fromy, tox, toy) {
        var headlen = 10/this.scale; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        this.context.moveTo(fromx, fromy);
        this.context.lineTo(tox, toy);
        this.context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.context.moveTo(tox, toy);
        this.context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }

    draw(highlight_cursor=false, highlight_arrowEnd=false, isCursorModified=false, isArrowEndModified=false) {
        this.context.clearRect(-this.translateX, -this.translateY, this.canvas.width, this.canvas.height)
        //this.context.fillRect(cursor.x,cursor.y,cursor.width,cursor.height)
        this.context.lineWidth = 3/this.scale;
        this.context.beginPath();
        this.context.arc(this.cursor.x, this.cursor.y, this.cursor.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle="black"
        this.context.fill();
        if (highlight_cursor) {
            this.context.lineWidth = 3/this.scale;
            this.context.strokeStyle = 'blue';
            this.context.stroke();
        }
        if (this.arrow) {
            this.context.beginPath()
            this.canvas_arrow(this.cursor.x,this.cursor.y,this.cursor.x+this.arrowEnd.r*Math.cos(this.arrowEnd.arg), this.cursor.y+this.arrowEnd.r*Math.sin(this.arrowEnd.arg))
            this.context.strokeStyle="black"
            this.context.stroke()
            if (highlight_arrowEnd) {
                this.context.beginPath()
                this.context.arc(this.cursor.x+this.arrowEnd.r*Math.cos(this.arrowEnd.arg), this.cursor.y+this.arrowEnd.r*Math.sin(this.arrowEnd.arg),this.arrowEnd.radius,0,2*Math.PI)
                this.context.lineWidth = 3/this.scale;
                this.context.strokeStyle = 'blue';
                this.context.stroke();
            }
        }
        /* let newPoint = nextPoint(cursor,arrowEnd.arg)
        if (newPoint!=null) {
            this.context.beginPath();
            this.context.moveTo(newPoint.x, newPoint.y);
            this.context.lineTo(newPoint.x+1000*Math.cos(newPoint.direction), newPoint.y+1000*Math.sin(newPoint.direction));
            this.context.strokeStyle = 'green';
            this.context.stroke();
        } */
        this.context.save();
        this.context.scale(1, -1);
        if (isCursorModified) {
            this.context.fillStyle="black"
            this.context.font = `${30/this.scale}px Arial`; 
            this.context.fillText(`X = ${(this.cursor.x).toFixed(Math.ceil(parseInt(range_input.value)+Math.log10(this.scale)))}; Y = ${(this.cursor.y).toFixed(Math.ceil(parseInt(range_input.value)+Math.log10(this.scale)))}`, (10-this.translateX)/this.scale, (100-this.translateY)/this.scale);
        }
        if (this.arrow && isArrowEndModified) {
            this.context.fillStyle="black"
            this.context.font = `${30/this.scale}px Arial`;
            this.context.fillText(`angle = ${(-this.arrowEnd.arg/Math.PI).toFixed(6)} PI`, (10-this.translateX)/this.scale, (100-this.translateY)/this.scale);
        }
        this.context.restore();
    }

    constructor(canvas, sync, arrow=false){

        this.canvas = canvas
        this.arrow = arrow;

        this.context = canvas.getContext("2d")
        this.context.canvas.width  = 0.5*window.innerWidth;
        this.context.canvas.height = 0.5*window.innerHeight;

        this.scale = 300
        this.translateX = canvas.width/2
        this.translateY = canvas.height/2

        this.context.translate(this.translateX,this.translateY);
        this.context.scale(this.scale,-this.scale);

        this.cursor = {
            x: 0,
            y: 0,
            radius: 20/this.scale
        }
        this.arrowEnd = {
            arg: 0, //0.713724379 == arctan(sqrt(3)/2)
            r: 100/this.scale,
            radius: 10/this.scale
        }

        this.offset = CanvasBehavior.getCoords(canvas)
        this.offset.top=(-this.offset.top+this.translateY)/this.scale
        this.offset.left=(this.offset.left+this.translateX)/this.scale
        
        this.draw()

        this.inCursor = false;
        this.posInCursor = null

        this.inArrowEnd = false;
        this.posInArrowEnd = null;
        this.initialPos = null;

        function mouseMove(e) {
            this.offset = CanvasBehavior.getCoords(this.canvas)
            this.offset.top=(-this.offset.top+this.translateY)/this.scale
            this.offset.left=(this.offset.left+this.translateX)/this.scale
            let eX=e.clientX/this.scale
            let eY=(2*this.translateY-e.clientY)/this.scale
            //this.inCursor= eX<=cursor.x+cursor.width+this.offset.left&&eX>=cursor.x+this.offset.left&&eY<=cursor.y+cursor.height+this.offset.top&&eY>=cursor.y+this.offset.top;
            this.inCursor = Math.sqrt(Math.pow(eX - this.cursor.x - this.offset.left, 2) + Math.pow(eY - this.cursor.y - this.offset.top, 2)) <= this.cursor.radius
            this.inArrowEnd = Math.sqrt(Math.pow(eX - (this.cursor.x+this.arrowEnd.r*Math.cos(this.arrowEnd.arg)) - this.offset.left, 2) + Math.pow(eY - (this.cursor.y+this.arrowEnd.r*Math.sin(this.arrowEnd.arg)) - this.offset.top, 2)) <= this.arrowEnd.radius
    
            if (this.posInCursor != null) {
                this.cursor.x = this.initialPos.x - Math.pow(10,-range_input.value)*(this.initialPos.x - eX) - this.posInCursor.x - this.offset.left
                this.cursor.y = this.initialPos.y - Math.pow(10,-range_input.value)*(this.initialPos.y - eY) - this.posInCursor.y - this.offset.top
                sync.bind(this)()
            }
            if (this.posInArrowEnd != null) {
                this.arrowEnd.arg = this.posInArrowEnd.arg + this.initialPos.arg - Math.pow(10,-range_input.value)*(this.initialPos.arg - Math.atan2((eY - this.cursor.y - this.offset.top),(eX - this.cursor.x - this.offset.left)))
                sync.bind(this)()
            }
            this.draw(this.inCursor, this.inArrowEnd, this.posInCursor != null, this.posInArrowEnd != null)
        }

        this.canvas.onmousemove = mouseMove.bind(this);
        this.canvas.onmousewheel = mouseMove.bind(this);

        this.canvas.onmousedown = function (e) {
            let eX=e.clientX/this.scale
            let eY=(2*this.translateY-e.clientY)/this.scale
            if (this.posInCursor == null && this.inCursor) {
                this.posInCursor = { x: eX - this.cursor.x - this.offset.left, y: eY - this.cursor.y - this.offset.top }
                this.initialPos = {x:eX, y: eY}
            }
            if (this.posInArrowEnd == null && this.inArrowEnd) {
                this.posInArrowEnd = { arg: this.arrowEnd.arg - Math.atan2((eY - this.cursor.y - this.offset.top),(eX - this.cursor.x - this.offset.left))}
                this.initialPos = {arg:Math.atan2((eY - this.cursor.y - this.offset.top),(eX - this.cursor.x - this.offset.left))}
            }
        }.bind(this)
        canvas.onmouseup = function (e) {
            this.posInCursor = null
            this.posInArrowEnd = null
        }.bind(this)
        canvas.onmouseleave = function () {
            this.posInCursor = null
            this.posInArrowEnd = null
            this.draw()
        }.bind(this)
        window.onresize=function(e){
            this.context.canvas.width  = 0.5*window.innerWidth;
            this.context.canvas.height = 0.5*window.innerHeight;
            this.translateX = canvas.width/2
            this.translateY = canvas.height/2
            this.context.translate(this.translateX,this.translateY);
            this.context.scale(this.scale,-this.scale);
            this.draw();
        }.bind(this)
    }
}

var x = complex(0)
var y = complex(0)

function sync_x() {
    x = complex(this.cursor.x,this.cursor.y)
    sync()
}

function sync_y() {
    y = complex(this.cursor.x,this.cursor.y)
    sync()
}

function sync_yoverx() {
    let z = complex(this.cursor.x,this.cursor.y)
    let omega = complex(this.arrowEnd.r*Math.cos(this.arrowEnd.arg),this.arrowEnd.r*Math.sin(this.arrowEnd.arg))
    x = div(omega,sub(1,pow(z,3)))
    y = div(mul(z,omega),sub(1,pow(z,3)))
    sync()
}

function sync_xovery() {
    let z = complex(this.cursor.x,this.cursor.y)
    let omega = complex(Math.cos(this.arrowEnd.arg),Math.sin(this.arrowEnd.arg))
    y = neg(div(omega,add(pow(z,3),1)))
    x = div(mul(z,omega),add(pow(z,3),1))
    sync()
}


var canvasX = new CanvasBehavior(left_top_canvas,sync_x);
var canvasY = new CanvasBehavior(left_bottom_canvas,sync_y)
var canvasYoverX = new CanvasBehavior(right_top_canvas,sync_yoverx,true);
var canvasXoverY = new CanvasBehavior(right_bottom_canvas,sync_xovery,true)

function sync() {
    canvasX.cursor.x=x.re
    canvasX.cursor.y=x.im
    canvasX.draw()
    canvasY.cursor.x=y.re
    canvasY.cursor.y=y.im
    canvasY.draw()
    canvasYoverX.cursor.x=div(y,x).re
    canvasYoverX.cursor.y=div(y,x).im
    canvasYoverX.arrowEnd.arg=arg(mul(sub(1,pow(div(y,x),3)),x))
    canvasYoverX.draw()
    canvasXoverY.cursor.x=neg(div(x,y)).re
    canvasXoverY.cursor.y=neg(div(x,y)).im
    canvasXoverY.arrowEnd.arg=arg(neg(mul(add(pow(neg(div(x,y)),3),1),y)))
    canvasXoverY.draw()
}



/* var p = p_input.value
    var q = q_input.value
    lineNumber_input.value = Math.abs(2*p-q) + Math.abs(p-2*q) + Math.abs(p+q) */