
function calculator(x, y, operator) {
    let result;
    switch (operator) {
        case '+':
            result = x + y;
            break;
        case '-':
            result = x - y;
            break;
        case '*':
            result = x * y;
            break;
        case '/':
            result = (x / y);
            if (!Number.isInteger(result) && y > x) result = result.toFixed(4);
            else if (!Number.isInteger(result)) result = result.toFixed(1);
    }
    return result;
}

function toggle_btn(val) {
    if (val == '+') idvalue = 'add';
    if (val == '-') idvalue = 'subtract';
    if (val == '*') idvalue = 'multiply';
    if (val == '/') idvalue = 'divide';
    document.getElementById(idvalue).classList.toggle("hl");
}

let inputString = '';
let num1 = 0;
let num2 = 0;
let operator = '';

function input(val) {
    let len = inputString.length;
    if (val == '+' || val == '-' || val == '*' || val == '/') {
        if (operator && val == '-') {
            return num1 = num1 * (-1);
        }
        num1 = parseFloat(inputString);
        operator = val;
        toggle_btn(val);
        inputString = '';
        console.log(num1, operator);
        return
    }
    else if (val == '=') {
        num2 = parseFloat(inputString);
        console.log(num2, val);
        let final_result = calculator(num1, num2, operator);
        console.log(final_result);
        document.querySelector('#display').value = final_result;
        inputString = final_result.toString();
        toggle_btn(operator);
        return
    }
    else if (val == 'AC') {
        console.log("reset")
        document.getElementById('display').value = '0';
        // toggle_btn(operator);
        inputString = '';
        num1 = 0;
        num2 = 0;
        operator = '';
        return;
    }
    else if (val == 'C') {
        console.log("Backspace")
        inputString = inputString.slice(0, -1);
    }
    else if (val == '.' && inputString.includes('.')) { return }
    else if (val == '0' && len == 1 && inputString[0] == '0') { return }
    else inputString += val;
    document.querySelector('#display').value = inputString;
}


document.querySelector("#zero").addEventListener("click", function () { input('0'); })
document.querySelector("#one").addEventListener("click", function () { input('1'); })
document.querySelector("#two").addEventListener("click", function () { input('2'); })
document.querySelector("#three").addEventListener("click", function () { input('3'); })
document.querySelector("#four").addEventListener("click", function () { input('4'); })
document.querySelector("#five").addEventListener("click", function () { input('5'); })
document.querySelector("#six").addEventListener("click", function () { input('6'); })
document.querySelector("#seven").addEventListener("click", function () { input('7'); })
document.querySelector("#eight").addEventListener("click", function () { input('8'); })
document.querySelector("#nine").addEventListener("click", function () { input('9'); })
document.querySelector("#decimal").addEventListener("click", function () { input('.'); })
document.querySelector("#add").addEventListener("click", function () { input('+'); })
document.querySelector("#subtract").addEventListener("click", function () { input('-'); })
document.querySelector("#multiply").addEventListener("click", function () { input('*'); })
document.querySelector("#divide").addEventListener("click", function () { input('/') })
document.querySelector("#equals").addEventListener("click", function () { input('='); })
document.querySelector("#backspace").addEventListener("click", function () { input('C'); })
document.querySelector("#clear").addEventListener("click", function () { input('AC'); })