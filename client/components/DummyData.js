function dummyData() {
    let arr = [];
    for(let i = 0; i < 100000; i++) {
        arr.push(makeObj())
    }
    return arr;
}

function makeObj() {
    let options = ["penguin", "horse", "airplane", "apple", "monkey"]
    let rand = Math.floor(Math.random()*5)
    let obj = {};
    for(let i = 0; i < 784; i++) {
    obj[i] = rand * .25;
    }
    obj.drawing = options[rand];
    return obj;
}

let data = dummyData();

export default data;
