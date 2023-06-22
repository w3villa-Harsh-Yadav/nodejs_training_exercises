const fs = require('fs')
const EventEmitter = require('events')
const os = require('os')

eventemitter = new EventEmitter()

require('dotenv').config()

fs.readFile('read.txt','utf-8',(err,data)=>{
    if(err){
        console.log(err)
    }else{
        console.log(data)
    }
})

eventemitter.on('hey',()=>{
    console.log("hello")
})

eventemitter.emit('hey')

console.log("Platform: " + os.platform());
console.log("Architecture: " + os.arch());


console.log(process.env.NAME)
