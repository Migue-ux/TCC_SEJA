// Script.js
          const textArea = document.getElementById('textArea');

          textArea.style.height = textArea.scrollHeight + "px";
          textArea.style.overflowY = "hidden";

          textArea.addEventListener("input", function () {
              this.style.height = "auto";
              this.style.height = this.scrollHeight + "px";
          });

