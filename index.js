var $ = require('jquery');

var DEFAULT = '<span class="ks-letter-count">还可以输入<em class="J_LetterRemain">{remain}</em>字节</span>';
var EXCEED = '<span class="ks-letter-count-exceed">已经超出<em class="J_LetterRemain exceed-letter">{remain}</em>字节</span>';

module.exports = Limiter;

function Limiter(el, options) {
  if(!(this instanceof Limiter)) return new Limiter(el, options);
  this.options = options;
  this.options.tpl = DEFAULT;
  this.el = (typeof el === 'string' ? $(el) : el);
  this.wrapper = $(this.options.wrapper);
  this.render();
}

Limiter.prototype.render = function (){
  var me = this;
  if(!this.el) return false;
  var text = this.el.val();
  this.count(text);
  this.el.on('keyup blur', function(){
    var _text = me.el.val();
    me.count(_text);
  });
};

Limiter.prototype.getlen = function (text) {
  var len = text.length;
  text.replace(/[\u0080-\ufff0]/g, function() {
    len++;
  });
  return len;
};

Limiter.prototype.count = function (text){
  var len = this.getlen(text);
  var max = this.options.max || 50;
  this.options.tpl = DEFAULT;
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