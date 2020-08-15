#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const addComment = require("./comment");
const log = console.log;

program.requiredOption("-p, --path <type>", "Path to the file or directory").option("-c, --comment <type>", "Comment to be added", "BINOD");

program.parse(process.argv);

const pathValue = program.path;
const comment = program.comment;

function directoryContents(d) {
    const listOfContents = fs.readdirSync(d);
    let ignoreList;
    const loop = function () {
        for (let f of listOfContents) {
            if (ignoreList && (ignoreList.includes(f) || ignoreList.includes("\\" + f) || ignoreList.includes("/" + f))) continue;
            const fullPath = path.join(d, f);
            if (fs.lstatSync(fullPath).isDirectory()) {
                directoryContents(fullPath);
            } else {
                addComment(fullPath, comment);
            }
        }
    };
    if (listOfContents.includes(".gitignore"))
        fs.readFile(path.join(d, ".gitignore"), function (err, buf) {
            ignoreList = buf.toString().split("\n");
            loop();
        });
    else loop();
}

fs.stat(pathValue, function (err, stat) {
    if (err === null) {
        if (stat.isDirectory()) directoryContents(pathValue);
        else addComment(pathValue, comment);
        log(chalk.green(`BINOD`));
        log(chalk.white.bgGreen(`  ${comment}  `));
    } else if (err.code === "ENOENT") {
        log(chalk.red("Path given is invalid. No such file or directory exists."));
    } else log(chalk.red(`Oops some error occured : ${err.code}`));
});
