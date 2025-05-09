import * as math from 'math';
import {sqrt, pi} from 'math';
const greet = (name = 'World')=>{
    console.log('Hello,', name);
}
const add = (x, y = 10)=>{
    return (x+y);
}
const nums = [1, 2, 3, 4, 5];
const squares = nums.map((n) => (n*n));
const doubled = Array(3).fill(null);
const user = {'name' : 'Alice', 'age' : 25};
const unique_items = new Set([1, 2, 2, 3]);
let total = 0;
for (let i= 0; i<5; i=i+1) {
    total += i
}
let i = 0;
while (i < 5) {
    total += i
    i += 1
}
let x = 10;
let y = 5;
const max_val = (x > y ? x : y);
if (x > y) {
    console.log('x is greater');
}
else {
    console.log('y is greater or equal');
}
const safe_divide = (a, b)=>{
    try {
        return (a/b);
    }
    catch (e) {
        console.log('Error:', e);
    }
    finally {
        console.log('Cleanup complete');
    }
}
const result = add(5);
greet('Naveen');
safe_divide(10, 0);
console.log('Sliced:', nums.slice(1,4));