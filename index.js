#!/usr/bin/env node

const program = require('commander');
const fs = require('fs')
const path = require('path')
const AWS = require("aws-sdk")
const s3 = new AWS.S3()

const bucket = "mzdev-oscar"
const prefix = "responses/v3prod/"

program
    .version('0.1.0')
    .option('-a, --account [a]', 'Account ID')
    .option('-t, --tenant [t]', 'Tenant RefID')
    .option('-s, --section [s]', 'Section RefID')
    .option('-i, --item [i]', 'Item RefID')
    .option('-d, --directory [d]', 'Directory of files to load')
    .option('-l, --list', 'Used for debugging - list the files already uploaded')

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ oscarload -a my_account -t my_tenant -s my_section -i my_item -d /path/to/responses');
    console.log('    $ oscarload -a my_account -t my_tenant -s my_section -i my_item -l');
    console.log('');
});

program.parse(process.argv);

validateArgs(program);

if (program.list) {
    listResponses();
} else {
    loadDirectory();
}



function listResponses() {
    var responseDir = path.join(prefix, program.location);
    responseDir = responseDir.split("\\").join("\/")
    var params = {
        Bucket: bucket,
        Prefix: responseDir
    };
    console.log("Listing:", responseDir)
    s3.listObjects(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            process.exit(1);
        }
        console.log(`Listing ${data.Contents.length} files.`)
        data.Contents.forEach(function (file) {
            console.log(`${file.Key} - ${file.LastModified}`);
        })
    })
}

function loadDirectory() {
    fs.readdir(program.directory, (err, files) => {
        files.forEach(file_name => {
            var filepath = path.join(program.directory, file_name);

            fs.readFile(filepath, (err, data) => {
                if (err && err.code == "EISDIR") {
                    console.log("Skipping directory:", filepath);
                    return;
                } else if (err) {
                    console.log("Error reading file:", filepath);
                    console.log(err);
                    process.exit(1);
                }

                var key = path.join(prefix, program.location, file_name);
                key = key.split("\\").join("\/")
                console.log("Loading:", key);

                var params = {
                    ACL: "private",
                    Body: data,
                    Bucket: bucket,
                    Key: key
                };

                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        process.exit(1);
                    }
                    console.log(data);
                })
            })
        });
    })
}



function validateArgs(program) {
    if (!program.account) {
        console.log("Must provide valid account (-a)");
        process.exit(1);
    }
    if (!program.tenant) {
        console.log("Must provide valid tenant (-t)");
        process.exit(1);
    }
    if (!program.section) {
        console.log("Must provide valid section (-s)");
        process.exit(1);
    }
    if (!program.item) {
        console.log("Must provide valid item (-i)");
        process.exit(1);
    }
    if (!program.directory && !program.list) {
        console.log("Must provide valid directory (-d) or run in debug mode (-l)");
        process.exit(1);
    }

    program.location = path.join(program.account, program.tenant, program.section, program.item);

    console.log(`Account   :${program.account}`);
    console.log(`Tenant    :${program.tenant}`);
    console.log(`Section   :${program.section}`);
    console.log(`Item      :${program.item}`);
    console.log(`Directory :${program.directory}`);
    console.log(`---------------------------------`);
}
