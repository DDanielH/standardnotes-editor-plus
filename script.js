 
	var check = convertHexToString('e29c94');
	var box   = convertHexToString('e29890');
	var strikethrough = convertHexToString('ccb6')
	
	String.prototype.setCharAt=function(index, chr)
        {
            if (index > this.length - 1) return this;
            return this.substr(0, index) + chr + this.substr(index + 1);
        }
	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.replace(new RegExp(search, 'g'), replacement);
	};
    String.prototype.replaceAt = function(index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    } //alert(hello.replaceAt(2, "!!")); //should display He!!o World
	String.prototype.findNext = function(start, search) {
		for(var i = start; i<this.length;i++)
		{
			if(this[i]==search)
				return i;
		}
        return this.length;
    } 
	
	String.prototype.findPref = function(start, search) {
		for(var i = start-1; i>=0;i--)
		{
			if(this[i]==search)
				return i;
		}
        return 0;
    } 
	
	
	String.prototype.replaceFirstInArea = function(Start,End, search, replacement) {
		for(var i = Start; i<End;i++)
		{
			if(this[i] == search)
			{
				return this.replaceAt(i,replacement);
			}
		}
		return this;
    } 
	
	String.prototype.toggleFirstInArea = function(Start,End, search, replacement) {
	
		var lastTabOrSpace = 0;
		var found = false;
		for(var i = Start; i<End;i++)
		{
			if((this[i] == " " || this[i] == "\t")&& !found)
			{
				lastTabOrSpace = i+1;
				continue;
			}
			found = true;
			if(this[i] == search)
			{	
				//var strToStrike = this.substring(i+1, End);
				var str = this;
				str = str.replaceAll(strikethrough,'');
				return str.replaceAt(i,replacement);
			}
			if(this[i] == replacement)
			{
				var str = this;
				for(var j = i+2; j<End*2;j+=2)
				{
					str = str.InsertAt(strikethrough,j);
				}
				return str.replaceAt(i,search);
			}
		}
		return this.InsertAt(box+" ",lastTabOrSpace);
    } 
	
	
    String.prototype.InsertAt = function(CharToInsert, Position) {
      return this.slice(0, Position) + CharToInsert + this.slice(Position)
    } //"20160923".InsertAt('-',4); //Output :"2016-0923"
    function convertHexToString(input) {
      // split input into groups of two
      var hex = input.match(/[\s\S]{2}/g) || [];
      var output = '';
      // build a hex-encoded representation of your string
      for (var i = 0, j = hex.length; i < j; i++) {
        output += '%' + ('0' + hex[i]).slice(-2);
      }
      // decode it using this trick
      output = decodeURIComponent(output);
      return output;
    }
    document.addEventListener("DOMContentLoaded", function(event) {
      var editor = document.getElementById("editor");
	//
	  //================Standardnote Stuff========================
	  
	  function updateData()
	  {
	   if (window.parent != window) {
          var text = editor.value || "";
          window.parent.postMessage({
            text: text,
            id: window.noteId
          }, '*');
        }
	  }
	  
      window.addEventListener("message", function(event) {
        console.log(event);
        if (event.data.id) {
          window.noteText = event.data.text || "";
          window.noteId = event.data.id;
          editor.value = window.noteText;
        }
      }, false);
      if (window.parent != window) {
        window.parent.postMessage({
          status: "ready"
        }, '*');
      }
      document.getElementById("editor").addEventListener("input", function(event) {
       updateData();
      });
	  //================Standardnote Stuff========================
	  
	  
	  
	  
	function editorInfos(editor){
		var str = editor.value;
		var indices = [];
		for (var i = 0; i < editor.selectionStart; i++) {
			if (str[i] === "\n") indices.push(i);
		}
		return indices;
	}
	
	function toggleTask(){
			var cursor = editor.selectionStart;
			var str = editor.value;
			var indices = editorInfos(editor);
			var lines = str.split('\n');
			var targetRow= lines[indices.length];
			var newRow = targetRow.toggleFirstInArea(0,targetRow.length-1,check,box);
			lines[indices.length] = newRow;
			var text = "";
			lines.forEach(function(l){
			text+= l+"\n";
			});
			editor.value = text;
			editor.selectionStart = editor.selectionEnd = cursor;
			
			updateData();
	}
	
	document.addEventListener('keydown', function(e) {
		 if (e.ctrlKey && e.keyCode == 13) { 
			//Place Cursor at new position aver linebreak
			editor.selectionStart = editor.selectionEnd = editor.selectionStart +2;
		 }
	 });
	
    editor.addEventListener('keydown', function(e) {
		if (e.ctrlKey&& e.keyCode == 68){//Str + D
			e.preventDefault();
			toggleTask();
			
		}
	  
        if (e.ctrlKey && e.keyCode == 13) { //Str + Enter		
			//remove Linebreak
			var cPos = editor.selectionStart;
			var nextLineBreak = editor.value.findNext(cPos,"\n");
			editor.value = editor.value.InsertAt(box+" ", nextLineBreak);
			editor.selectionStart = editor.selectionEnd = nextLineBreak;
			updateData();
        }
      }, false);
	  
	 editor.onclick = function(e){
		var s = editor.selectionStart;
		if(editor.value[s] == check || editor.value[s+1] == check || editor.value[s-1] == check)
		{toggleTask();}
		else if(editor.value[s] == box || editor.value[s+1] == box || editor.value[s-1] == box)
		{toggleTask();}
		
	 };
	  
	  
	tabOverride.set(editor);
	  
    });