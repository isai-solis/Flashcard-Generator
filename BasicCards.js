var fs = require("fs");

module.exports = BasicFlashCard;

function BasicFlashCard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {

        var data = {
            front: this.front,
            back: this.back,
            type: "basic",
        };

        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {

            if (error) {
                console.log(error);
            }
        });
    };
}