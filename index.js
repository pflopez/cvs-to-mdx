const fs = require("fs");
const { parse } = require("csv-parse");

let headers = [];
let rows = [];
let first = true;

fs.createReadStream("./input.csv")

  .pipe(parse({ delimiter: ",", from_line: 1 }))
  .on("data", function (row) {
    if (first) {
      headers = row;
      first = false;
    } else {
      rows.push(row);
    }
  })
  .on("end", function () {
    printResults();
  })
  .on("error", function (error) {
    console.log(error.message);
  });

function printResults() {
  rows.forEach((row) => {
    const fileName = replaceSpecialChars(row[0].toLowerCase());
    const content = printResult(row);

    saveToFile(fileName, content);
  });
}

const replaceSpecialChars = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/([^\w]+|\s+)/g, "-") // Replace space and other characters by hyphen
    .replace(/\-\-+/g, "-") // Replaces multiple hyphens by one hyphen
    .replace(/(^-+|-+$)/g, ""); // Remove extra hyphens from beginning or end of the string
};

function saveToFile(name, content) {
  var dir = "./output";
  const fileName = dir + "/" + name + ".mdx";

  console.log("saving ", fileName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // Use fs.createWriteStream() method
  // to write the file
  let writer = fs.createWriteStream(fileName);

  // Read and display the file data on console
  writer.write(content);
}

function printResult(row) {
  let result = "---\n";
  row.forEach((data, index) => {
    if (headers[index].toLowerCase() === "category") {
      result += headers[index] + ": \n";
      const splited = data.split(",");
      splited.forEach((d) => {
        result += "- " + d.trim() + "\n";
      });
    } else {
      result += headers[index] + ": " + data.trim() + "\n";
    }
  });
  result += "----";
  return result;
}
