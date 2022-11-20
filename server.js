const http = require("http");
const fs = require("fs");
// const isPrime = require("./comps/primes");
// const factorial = require("./comps/primes");
function factorial(num) {
  let result = 1;
  for (let i = 1; i <= num; i++) {
    result *= i;
  }
  return result;
}

const isPrime = (num) => {
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
};

const server = http
  .createServer((req, res) => {
    if (req.url === "/contacts") {
      fs.readFile("." + req.url + ".json", (err, data) => {
        if(err) {
          res.writeHead(404, { "content-type": "text/html" });
          res.write("404");
          return res.end();
        }
        res.writeHead(200, { "content-type": "application/json" });
        console.log(req.url);
        res.write(data.toString());
        return res.end();
      });
    }
    if (req.url.startsWith("/contacts/")) {
      const id = req.url.split("/")[2];

      fs.readFile("./contacts.json", (err, data) => {
        const parseData = JSON.parse(data);
        const find = parseData.find((e) => e.id == id);
        console.log(find);
        if (err) {
          res.writeHead(404, { "content-type": "text/html" });
          res.write("404");
          return res.end();
        }
        if (!find) {
          res.statusCode(404);
          res.write("no such user");
          return res.end();
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(find));
        return res.end();
      });
    } else {
      fs.readFile("." + req.url + ".html", (err, data) => {
        if (data) {
          res.writeHead(200, { "content-type": "text/html" });
          res.write(data.toString());
          return res.end();
        }
        if (err) {
          res.writeHead(404, { "content-type": "text/html" });
          res.write("404");
          return res.end();
        }
      });
    }
    // comps
    if (req.url.startsWith("/comps/")) {
      const num = req.url.split("/")[3];
      const currentComps = req.url.split("/")[2];
      console.log("curentComps:", currentComps, "\nnum:", num);

      //factorial
      if (currentComps == "factorial") {
        res.writeHead(200, { "Content-type": "text/html" });
        res.write(factorial(num).toString());
        res.end();
      }

      // prime
      if (currentComps == "prime") {
        res.writeHead(200, { "Content-type": "text/html" });
        res.write(isPrime(num).toString());
        res.end();
      }
    }
  })

  .listen(3001);
