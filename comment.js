const path = require("path");
const fs = require("fs");

function addComment(f, c) {
    const extension = path.extname(f);
    const commentToBeAdded = comment(extension, c);
    if (commentToBeAdded !== null) {
        fs.readFile(f, function (err, buf) {
            let content = commentToBeAdded + "\n" + buf.toString();
            fs.writeFile(f, content, (err) => {
                if (err) console.log(err);
            });
        });
    }
}

function comment(e, c) {
    let commentToBeAdded;
    switch (e) {
        case ".js":
            commentToBeAdded = `// ${c}`;
            break;
        case ".ts":
            commentToBeAdded = `// ${c}`;
            break;
        case ".css":
        case ".scss":
            commentToBeAdded = `/* ${c} */`;
            break;
        case ".html":
            commentToBeAdded = `<!--  ${c}  -->`;
            break;
        default:
            commentToBeAdded = null;
    }
    return commentToBeAdded;
}

module.exports = addComment;
