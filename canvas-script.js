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

    draw_noclear(highlight_cursor=false, highlight_arrowEnd=false, isCursorModified=false, isArrowEndModified=false) {
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

    draw(highlight_cursor=false, highlight_arrowEnd=false, isCursorModified=false, isArrowEndModified=false){
        this.context.clearRect(-this.translateX, -this.translateY, this.canvas.width, this.canvas.height)
        this.draw_noclear(highlight_cursor, highlight_arrowEnd, isCursorModified, isArrowEndModified)
    }

    syncData(arrowEnd=false){
        this.sync.bind(this)()
    }

    constructor(canvas, sync, arrow=false, scale=100, translateX=(w)=>w/2, translateY=(h)=>h/2){

        this.canvas = canvas
        this.sync = sync
        this.arrow = arrow;

        this.context = canvas.getContext("2d")
        this.context.canvas.width  = 0.5*window.innerWidth;
        this.context.canvas.height = 0.5*window.innerHeight;

        this.scale = scale
        this.translateX = translateX(canvas.width)
        this.translateY = translateY(canvas.height)

        this.context.translate(this.translateX,this.translateY);
        this.context.scale(this.scale,-this.scale);

        this.cursor = {
            x: 0,
            y: 0,
            radius: 10/this.scale
        }
        this.arrowEnd = {
            arg: 0, //0.713724379 == arctan(sqrt(3)/2)
            r: 100/this.scale,
            radius: 10/this.scale
        }

        this.offset = CanvasBehavior.getCoords(canvas)
        this.offset.top=(-this.offset.top+this.translateY)/this.scale
        this.offset.left=(this.offset.left+this.translateX)/this.scale

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
                this.syncData()
            }
            if (this.posInArrowEnd != null) {
                this.arrowEnd.arg = this.posInArrowEnd.arg + this.initialPos.arg - Math.pow(10,-range_input.value)*(this.initialPos.arg - Math.atan2((eY - this.cursor.y - this.offset.top),(eX - this.cursor.x - this.offset.left)))
                this.syncData(true)
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

class BilliardBehavior extends CanvasBehavior{

    static behavior(point, direction, line) {
        let lineAngle = Math.atan2(line.v.y-line.u.y,line.v.x-line.u.x)
        return {point:point,direction:2*lineAngle-direction}    
    }

    static angleFromPQ() {
        return Math.atan2(Math.sqrt(3)*q_input.value,2*p_input.value-q_input.value)
    }
    
    deletePQ(){
        p_input.value=""
        q_input.value=""
        lineNumber_proposition.innerHTML="NaN"
    }

    draw_noclear(highlight_cursor=false, highlight_arrowEnd=false, isCursorModified=false, isArrowEndModified=false) {
        this.context.beginPath();
        this.context.moveTo(this.figure[this.figure.length-1].x,this.figure[this.figure.length-1].y)
        for (let i = 0; i < this.figure.length; i++) {
            this.context.lineTo(this.figure[i].x,this.figure[i].y)
        }
        this.context.lineWidth = 3/this.scale;
        this.context.strokeStyle = 'black';
        this.context.stroke();
        super.draw_noclear(highlight_cursor, highlight_arrowEnd, isCursorModified, isArrowEndModified)
        for (let i = 0; i < this.points.length-1&&this.points[i]!=null; i+=2) {
            if (this.points[i+1]==null) {
                this.context.beginPath();
                this.context.moveTo(this.points[i].x, this.points[i].y);
                this.context.lineTo(this.points[i].x+1000*Math.cos(this.last_direction), this.points[i].y+1000*Math.sin(this.last_direction));
                this.context.strokeStyle = this.line_colors[i%2];
                this.context.stroke();   
            } else {
                this.context.beginPath();
                this.context.moveTo(this.points[i].x, this.points[i].y);
                this.context.lineTo(this.points[i+1].x, this.points[i+1].y);
                this.context.strokeStyle = this.line_colors[i%2];
                this.context.stroke();
                this.context.beginPath();
                this.context.arc(this.points[i+1].x, this.points[i+1].y, 5/this.scale, 0, 2 * Math.PI, false);
                this.context.fillStyle=this.line_colors[i%2]
                this.context.fill();
            }
        }

        this.context2.clearRect(-this.translateX, -this.translateY, this.canvas.width, this.canvas.height)
        this.context2.beginPath();
        this.context2.moveTo(this.figure[this.figure.length-1].x,this.figure[this.figure.length-1].y)
        for (let i = 0; i < this.figure.length; i++) {
            this.context2.lineTo(this.figure[i].x,this.figure[i].y)
        }
        this.context2.lineWidth = 3/this.scale;
        this.context2.strokeStyle = 'black';
        this.context2.stroke();
        for (let i = 1; i < this.points.length-1&&this.points[i]!=null; i+=2) {
            if (this.points[i+1]==null) {
                this.context2.beginPath();
                this.context2.moveTo(this.points[i].x, this.points[i].y);
                this.context2.lineTo(this.points[i].x+1000*Math.cos(this.last_direction), this.points[i].y+1000*Math.sin(this.last_direction));
                this.context2.strokeStyle = this.line_colors[i%2];
                this.context2.stroke();   
            } else {
                this.context2.beginPath();
                this.context2.moveTo(this.points[i].x, this.points[i].y);
                this.context2.lineTo(this.points[i+1].x, this.points[i+1].y);
                this.context2.strokeStyle = this.line_colors[i%2];
                this.context2.stroke();
                this.context2.beginPath();
                this.context2.arc(this.points[i+1].x, this.points[i+1].y, 5/this.scale, 0, 2 * Math.PI, false);
                this.context2.fillStyle=this.line_colors[i%2]
                this.context2.fill();
            }
        }
    }

    syncData(arrowEnd){
        super.syncData(arrowEnd)
        this.createPoints()
        if (arrowEnd) {
            this.deletePQ()
        }
    }

    nextPoint(point,direction,lasti) {
        let nexti = null;
        let line = null
        let temp_point={x:point.x+1000*Math.cos(direction),y:point.y+1000*Math.sin(direction)}
        let ip1=0
        for (let i = 0; i < this.figure.length; i++) {
            if (i==this.figure.length-1) {
                ip1=0
            }else{
                ip1=i+1
            }
            if(lasti!=i && doIntersect({u:this.figure[i],v:this.figure[ip1]}, {u:{x:point.x,y:point.y},v:{x:temp_point.x+Math.cos(direction)/this.scale,y:temp_point.y+Math.sin(direction)/this.scale}})){
                line={u:this.figure[i],v:this.figure[ip1]}
                let result = line_intersect(line, {u:point,v:{x:point.x+Math.cos(direction)/this.scale,y:point.y+Math.sin(direction)/this.scale}})
                temp_point = {x:result.x,y:result.y}
                nexti=i
            }
        }
        /* a1=Math.tan(direction)
        b1=point.y-a1* */
        let newPointDirection = null
        if (line!=null) {
            newPointDirection = BilliardBehavior.behavior(temp_point,direction,line)
            newPointDirection.lasti=nexti
        }
        return newPointDirection
    }
    
    createPoints(){
        let lasti=null
        this.last_direction=this.arrowEnd.arg
        this.points=new Array(parseInt(lineNumber_input.value)+1)
        this.points[0]=this.cursor
        let result=null
        for (let i = 0; i < this.points.length-1 && this.points[i]!=null; i++) {
            result = this.nextPoint(this.points[i],this.last_direction, lasti)
            lasti=result!=null ? result.lasti : null
            this.points[i+1]=result!=null ? result.point : null
            this.last_direction=result!=null ? result.direction : this.last_direction
        }
    }

    constructor(canvas, canvas2, sync){
        super(canvas, sync, true, 300, (w)=>w/2, (h)=>h*(1/2+sqrt(3)/12))

        this.cursor.x = 1/8
        this.cursor.y = sqrt(3)/6/* 

        this.context.scale(1/this.scale,-1/this.scale)
        this.context.translate(-this.translateX,-this.translateY);

        this.translateX = this.canvas.width/2
        this.translateY = this.canvas.height*(1/2+sqrt(3)/12)
        this.scale = 300

        this.context.translate(this.translateX,this.translateY);
        this.context.scale(this.scale,-this.scale);
 */
        this.canvas2 = canvas2
        this.context2 = this.canvas2.getContext("2d")

        this.context2.canvas.width  = 0.5*window.innerWidth;
        this.context2.canvas.height = 0.5*window.innerHeight;
        this.context2.translate(this.translateX,this.translateY);
        this.context2.scale(this.scale,-this.scale);

        this.figure=[{x:0,y:0},{x:1/2,y:Math.sqrt(3)/6},{x:0,y:Math.sqrt(3)/3}]
        this.points=new Array(10)
        this.last_direction=this.arrowEnd.arg

        this.line_colors=["green","red"]

        lineNumber_input.onchange=function(e){
            this.syncData()
            this.draw()
        }.bind(this)
        lineNumber_input.onchange=function(e){
            this.syncData()
            this.draw()
        }.bind(this)
        
        function p_qChange() {
            var p = parseInt(p_input.value)
            var q = parseInt(q_input.value)
            if (!(isNaN(p)||isNaN(q))) {
                lineNumber_proposition.innerHTML = (Math.abs(2*p-q) + Math.abs(p-2*q) + Math.abs(p+q))/gcd(p,q) +1
                this.arrowEnd.arg=BilliardBehavior.angleFromPQ(p,q)
                this.syncData()
                this.draw()
            }
        }
        
        p_input.onchange=p_qChange.bind(this);
        q_input.onchange=p_qChange.bind(this);
        
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

function sync_billiard() {
    let z = complex(this.cursor.x, this.cursor.y)
    let omega = mul(exp(complex(0, this.arrowEnd.arg)), complex(-1 / 2, sqrt(3) / 2))

    z = mul(beta(1 / 3, 1 / 3), add(1 / 3, mul(z, complex(1 / 2, sqrt(3) / 2))))

    let u = weierstrassP(z, 0, 1 / 27);
    let v = weierstrassPPrime(z, 0, 1 / 27);
    [x, y] = [div(mul(6, u), add(mul(3, v), 1)), div(sub(1, mul(3, v)), add(1, mul(3, v)))].map(a =>
        mul(a, beta(1 / 3, 1 / 3), omega)
    );
    y=mul(y,complex(-1/2,-sqrt(3)/2))
    sync()
}



var canvasX = new CanvasBehavior(left_top_canvas,sync_x);
canvasX.draw();
var canvasY = new CanvasBehavior(left_bottom_canvas,sync_y);
canvasY.draw();
var canvasYoverX = new CanvasBehavior(right_top_canvas,sync_yoverx,true);
canvasYoverX.draw();
var canvasXoverY = new CanvasBehavior(right_bottom_canvas,sync_xovery,true);
canvasXoverY.draw();

var canvasBilliard = new BilliardBehavior(top_billiard, bottom_billiard,sync_billiard);
canvasBilliard.createPoints();
canvasBilliard.draw();

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
    if (autoSync_button.checked) {
        syncData()
    }
}

function getData() {
    return [x,y]
}


/* var p = p_input.value
    var q = q_input.value
    lineNumber_input.value = Math.abs(2*p-q) + Math.abs(p-2*q) + Math.abs(p+q) */