function fetchData(url) {
  return new Promise((resolve, reject) => {
    console.log("started downloading from ", url);
    setTimeout(function processDownload() {
      console.log("download completed");
      //resolve("dummy data");
    }, 7000);
  });
}

async function processing() {
  console.log("inside processing");
  let value1 = await fetchData("www.google.com");
  console.log("data downloaded", value1);
  let value2 = await fetchData("www.facebook.com");
  console.log("data downloaded", value2);
  console.log("processing completed");
  return value1 + value2;
}

console.log("start");
setTimeout(function time1() {
  console.log("timer1");
}, 0);

let x = processing();
x.then(function (data) {
  console.log("processing promise resolved with ", data);
});

setTimeout(function time2() {
  console.log("timer2");
}, 1000);

setTimeout(function time3() {
  console.log("timer3");
}, 0);

console.log("end");
