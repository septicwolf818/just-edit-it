        var livePreviewIsOn = false;
         var livePreview;
         var htmlCode;
         var codeArea;
         var checkbox;
         var sizeInput;


         function liveRegenerate(){
         if(livePreviewIsOn){
         htmlCode = codeArea.value;
         livePreview.srcdoc = htmlCode;
         }
         }
         function toggleLivePreview(){

         livePreviewIsOn = !livePreviewIsOn;
         if(livePreviewIsOn) { checkbox.style.color = "lime"; checkbox.innerHTML = "&#10003;"; livePreviewEnabled();}
         else { checkbox.style.color = "red"; checkbox.innerHTML = "&#10006;"; livePreviewDisabled()}
         }
         function livePreviewDisabled(){
         livePreview.srcdoc = "<style>* {background: #333}</style><h1 style=\"line-height: 100%; align-self: center;color: white; font-family: sans-serif; text-align: center; width: 100%;\">Podgląd na żywo jest wyłączony</h1>";
         }

         function livePreviewEnabled(){
         htmlCode = codeArea.value;
         livePreview.srcdoc = htmlCode;
         }

         function checkFontSize(x) {
         if(isNaN(x)) return false;
         else return true;
         }

         function fontUp(){
         if(checkFontSize(sizeInput.value)){
         sizeInput.value = parseInt(sizeInput.value)+1;
         codeArea.style.fontSize = sizeInput.value + "px";
         }
         else {
         codeArea.style.fontSize = "20";
         sizeInput.value = "20";
         }

         }
         function fontDown(){
         if(checkFontSize(sizeInput.value)){
         sizeInput.value = parseInt(sizeInput.value)-1;
         codeArea.style.fontSize = sizeInput.value + "px";
         }
         else {
         codeArea.style.fontSize = "20";
         sizeInput.value = "20";
         }

         }
         function setFont(){
         if(checkFontSize(sizeInput.value)){
         codeArea.style.fontSize = sizeInput.value + "px";
         }
         else {
         codeArea.style.fontSize = "20";
         sizeInput.value = "20";
         }

         }


        function loadBlankPage(){
            var pageSrc = '<html>\n\t<head>\n\t\t<title>Moja strona</title>\n\t\t<meta charset="utf-8"/>\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n\t</head>\n\t<body>\n\t\t<h1>Nagłówek 1</h1>\n\t\t<p>Akapit</p>\n\t</body>\n</html>';
            codeArea.value = pageSrc;
        }
          
        function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
        }
          function makeName() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
}
         function savePage(){
             download(codeArea.value, makeName()+".html", "html");
         }
         function init(){

         livePreview = document.getElementById("editor-preview");
         codeArea = document.getElementById("editor-codearea");
         checkbox = document.getElementById("live-checkbox");
         sizeInput = document.getElementById("editor-font-size");
         livePreviewDisabled();
         }


         function enableTab(id) {
            var el = document.getElementById(id);
            el.onkeydown = function(e) {
                if (e.keyCode === 9) { // tab was pressed

                    // get caret position/selection
                    var val = this.value,
                        start = this.selectionStart,
                        end = this.selectionEnd;
                    // set textarea value to: text before caret + tab + text after caret
                    this.value = val.substring(0, start) + '\t' + val.substring(end);

                    // put caret at right position again
                    this.selectionStart = this.selectionEnd = start + 1;

                    // prevent the focus lose
                    return false;

                }
            };
        }