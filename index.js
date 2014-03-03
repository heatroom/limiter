var $ = require('jquery');


var DEFAULT = '<span class="ks-letter-count">还可以输入<em class="J_LetterRemain">{remain}</em>字节</span>';
var EXCEED = '<span class="ks-letter-count-exceed">已经超出<em class="J_LetterRemain exceed-letter">{remain}</em>字节</span>';

var Limiter = function(el, options) {
	if(!(this instanceof Limiter)) return new Limiter(el, options);
	this.options = options;
	this.options.tpl = DEFAULT;
	this.el = $(el);
	this.wrapper = $(this.options.wrapper);
	this.render();
}

Limiter.prototype.render = function (){
	var me = this;
	if(!this.el) return false;
	this.count();
	this.el.on('keyup blur', function(){
		me.count();
	});

};

Limiter.prototype.getlen = function () {
	var val = this.el.val();
	var len = val.length;

	val.replace(/[\u0080-\ufff0]/g, function() {
        len++;
    });
    //calculate the chinese character length
    val = val.replace(/[^\x00-\xff]/g,"**");
    len = Math.ceil(val.length/2);
    return len;
};

Limiter.prototype.count = function (){
	var len = this.getlen();
	var max = this.options.max || 50;
	var defautTpl = DEFAULT;
	var exceedTpl = EXCEED;
	if(len > max) this.options.tpl = EXCEED;
    this.create(len);
};

Limiter.prototype.create = function (len) {
	var max = this.options.max,
	    tpl = this.options.tpl,
	    html;
	if(!this.el.length) return false;
	function substitute(str, o, regexp) {
        return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (o[name] === undefined) ? "" : o[name];
    	});
    }
    html = substitute(tpl, {len:len, max:max, remain:Math.abs(max-len)});
    this.wrapper.html(html);
};

module.exports = Limiter;