
$(document).ready(function() {
    
  // jQuery func
  $.fn.textWidth = function(text, font, fontSize) {
    if (!$.fn.textWidth.placeholderEl) $.fn.textWidth.placeholderEl 
    = $('<span>').appendTo(document.body);

    var validText = text || this.val() || this.text();
    font = font.replace(/"/g, '');
    $.fn.textWidth.placeholderEl.text(validText).css({'font-family': font, 'font-size': fontSize});
    return $.fn.textWidth.placeholderEl.width();
  };

  // DblLineWithEllipsis

  function DblLineWithEllipsis(newParagraph, calcTextWidthFunc, eleSelector, newFont, newFontSize) {
    this._paragraph = newParagraph;
    this._textWidthFunc = calcTextWidthFunc;
    this._font = newFont;
    this._fontSize = newFontSize;
    this.LIMIT = $(eleSelector).width();
    this._paragraphFormat = [];
    this._paragraphFormatCur = 0;
    this._totalTextWidth = 0;
    this._placeHolderInDOM;
  }

  DblLineWithEllipsis.prototype.calculateWidthOfSpace = function() {
    var l = this._textWidthFunc('l', this._font, this._fontSize);
    var l_space_l = this._textWidthFunc('l l', this._font, this._fontSize);
    return l_space_l - (2 * l);
  }
  
  DblLineWithEllipsis.prototype.getCharWidth = function (str, widthOfSpace, callback) {
    if (str == ' ') {callback(widthOfSpace, true);} 
    else {callback(this._textWidthFunc(str, this._font, this._fontSize), false);}
  }

  DblLineWithEllipsis.prototype.textWidthPastLimit = function() {return (this._totalTextWidth > this.LIMIT);}
  DblLineWithEllipsis.prototype.storeString = function(strHolder) {this._paragraphFormat[this._paragraphFormatCur++] = strHolder;}
  DblLineWithEllipsis.prototype.charIsSpace = function(ch) {return (ch == ' ');}

  DblLineWithEllipsis.prototype.splitHoldStringByLastSpace = function(strHolder) {
    var indexOfLastSpace = strHolder.lastIndexOf(' ');
    var prev = strHolder.slice(0, indexOfLastSpace+1);
    this.storeString(prev);
    var next = strHolder.slice(indexOfLastSpace+1, strHolder.length);
    this._totalTextWidth = this._textWidthFunc(next, this._font, this._fontSize);
    return next;
  }

  DblLineWithEllipsis.prototype.calcNumOfLines = function() {
    var SPACE_WIDTH = this.calculateWidthOfSpace(this._font, this._fontSize);
    var characterArray = this._paragraph.split('');
    var holder = "";
    var previousSpaceExists;

    var self = this;
    for (var i = 0; i < characterArray.length; i++) {
        this.getCharWidth(characterArray[i], SPACE_WIDTH, function(width, isSpace) { 
            if (isSpace) previousSpaceExists = true;
            self._totalTextWidth +=  width;
        });
        holder += characterArray[i];
        if (this.textWidthPastLimit()) {
            if (this.charIsSpace(characterArray[i])) {
            this.storeString(holder);
            holder = '';
            this._totalTextWidth = 0;
            } else if (previousSpaceExists) {
                previousSpaceExists = false;
                holder = this.splitHoldStringByLastSpace(holder);
            }
        }
    } 
    this.storeString(holder);
    return this._paragraphFormat.length;
  }

  // test cases
  //var TEXT = 'abcdefghijklmnopqrstuvwxyz';
  //var TEXT = 'abcdefghijklm nop';
  //var TEXT = 'abc defghijklmnop';  
  //var TEXT = 'abc defghijklm nop';
  //var TEXT = 'abc def ghi jkl mama nop';
  //var TEXT = 'def ghi jkl';
  //var TEXT = 'lll lll lll lll ll';
  //var TEXT = 'lll lll lll lll lll';
  var TEXT = 'a b c d e f g h i j k l m n o p q r s t u v w x y z';

  $("#para").text(TEXT);
  var para = document.querySelector("#para");
  var font = window.getComputedStyle(para).getPropertyValue('font-family');
  font = font.replace(/"/g, ''); // remove all quotes 
  var fontSize = window.getComputedStyle(para).getPropertyValue('font-size');
  fontSize = fontSize.replace(/"/g, ''); // remove all quotes 

  var temp = new DblLineWithEllipsis(TEXT, $.fn.textWidth, "#para", font, fontSize);
  var num = temp.calcNumOfLines(font, fontSize);
  console.log('there are: ' + num + ' number of lines in the paragraph: ' + TEXT);
});




