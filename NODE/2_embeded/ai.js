const EventEmitter = require("events");
class AI extends EventEmitter{
    constructor(name) {
        super();
        this.name= name;
        this.on("eat",(target) => {
            console.log(`${this.name} ${target}는 맛있다.`);
        });
        this.on("sleep", (time)=>{
            console.log(`${this.name} ${time}시간 잠든다.`)
        });
    }
}

module.exports = AI;