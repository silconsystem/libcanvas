/*
---

name: "Shape"

description: "Abstract class LibCanvas.Shape defines interface for drawable canvas objects"

license:
	- "[GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)"
	- "[MIT License](http://opensource.org/licenses/mit-license.php)"

authors:
	- "Shock <shocksilien@gmail.com>"

requires:
	- LibCanvas
	- Geometry
	- Point

provides: Shape

...
*/

var shapeTestBuffer = Buffer(1, 1, true);

var Shape = LibCanvas.Shape = Class({
	Extends    : Geometry,
	set        : Class.abstractMethod,
	hasPoint   : Class.abstractMethod,
	processPath: Class.abstractMethod,
	draw : function (ctx, type) {
		this.processPath(ctx)[type]();
		return this;
	},
	// Методы ниже рассчитывают на то, что в фигуре есть точки from и to
	getCoords : function () {
		return this.from;
	},
	get x () {
		return this.getCoords().x;
	},
	get y () {
		return this.getCoords().y;
	},
	set x (x) {
		return this.move({ x : x - this.x, y : 0 });
	},
	set y (y) {
		return this.move({ x : 0, y : y - this.y });
	},
	get bottomLeft () {
		return new Point(this.from.x, this.to.y);
	},
	get topRight () {
		return new Point(this.to.x, this.from.y);
	},
	get center () {
		return new Point(
			(this.from.x + this.to.x) / 2,
			(this.from.y + this.to.y) / 2
		);
	},
	getCenter : function () {
		return this.center;
	},
	move : function (distance, reverse) {
		distance = this.invertDirection(distance, reverse);
		this.fireEvent('beforeMove', distance);
		this.from.move(distance);
		this. to .move(distance);
		return this.parent(distance);
	},
	equals : function (shape, accuracy) {
		return shape instanceof this.self &&
			shape.from.equals(this.from, accuracy) &&
			shape.to  .equals(this.to  , accuracy);
	},
	clone : function () {
		return new this.self(this.from.clone(), this.to.clone());
	},
	getPoints : function () {
		return { from : this.from, to : this.to };
	},
	dump: function (shape) {
		if (!shape) return this.toString();
		var p = function (p) { return '[' + p.x + ', ' + p.y + ']'; };
		return '[shape ' + shape + '(from'+p(this.from)+', to'+p(this.to)+')]';
	},
	toString: Function.lambda('[object LibCanvas.Shape]')
});