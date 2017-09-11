var fs = require("fs");

module.exports = ClozeFlashCard;

function ClozeFlashCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.partial = this.text.replace(this.cloze, '_____');
    this.create = function() {
        var data = {
            text: this.text,
            cloze: this.cloze,
            partial: this.partial,
            type: "cloze"
        };
        
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            if (error) {
                console.log(error);
            }
        });
    };
}