// Chapter 3 Events and callbacks

// Exercise 1

const EventEmitter = require("events");

const eventemitter = new EventEmitter();

eventemitter.on('start',(msg)=>{
    console.log(msg);
    console.log("start event occured")
})

eventemitter.emit('start',"Emmiting start event")


// Exercise 2

const b = (a)=>{
    setTimeout(() => {
        a();
    }, 1000);
}

b(()=>{
    console.log("This callback is called after 1 Second delay")
})


// Exercise 3(Optional)

const add = (a,b,c) =>{
    let sum = a+b;
    c(sum);
}

add(2,3,(sum)=>{
    console.log(`Sum of two number is ${sum}`)
})
