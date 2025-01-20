var fs  = require('fs');

// sync는 return값이 있음
// console.log('A');
// var result = fs.readFileSync('jsSet/sample.txt', 'utf8')
// console.log(result);
// console.log('C');


// Async는 return값이 없고 콜백 함수가 호출됨됨, 'jsSet/sample.txt'의 내용이 result에 담김김
console.log('A');
fs.readFile('jsSet/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C');