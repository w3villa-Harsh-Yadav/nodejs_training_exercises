const fs = require("fs");

try {
  fs.readFile("read.txt", "utf-8", (err, data) => {
    if (err) {
      return err;
    } else {
      fs.writeFile("write.txt", data, () => {
        console.log("Done");
      });
    }
  });
} catch (error) {
  console.log(error);
}
