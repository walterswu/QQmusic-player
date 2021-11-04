//单行输入
// var readline = require('readline')
// const rl = readline.createInterface({
//   input:process.stdin,
//   output:process.stdout
// })
// rl.on('line',function(line){
//   var arr= line.split(' ');
//   console.log(parseInt(arr[0])+parseInt(arr[1]));
// })


// 任意行输入
// var readline = require('readline')
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })
// var inputs = []
// rl.on('line', function(line){
//   //trim()去除字符串两边的空白,line表示一行输入，最终得到的inputs数组的每一个元素表示一行输入。
//   inputs.push(line.trim());
//   console.log(inputs)
//   //下面再根据要求对每一行数据进行处理，比如类似于单行输入将每一行数据按照空格转换为数组等
//   //  ...
// })
// //console.log(inputs) // 不要在 rl.on 函数外面输出，否则会输出空串，因为 rl.on 是异步操作

// 固定行输入
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var inputArr = [];
rl.on('line', function (input) {
    inputArr.push(input);
    var nLine = +inputArr[0];
    if (inputArr.length == (nLine + 1)) {
        var arr = inputArr.slice(1);
        console.log(arr);
        inputArr = [];
    }
});