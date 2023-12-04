// Henry Wessson
// SD 230
// 11/6/2023
// Calculator - JavaScript

// This is the JavaScript file for my Calculator program. 
// Contains the functions that handle the logic of the calculator

let history = ''; // sets history to empty
let theme = 'light-theme'; // sets theme to light theme by default
let input = ''; // sets input to empty string

function inputChar(char) { // function adds inputted characters from pressing buttons to input and displays it in the window
    input += char; // adds inputted characters to input 
    document.getElementById('display').value = input; // updates the calculator display
}

function negSign() { // this is function to add a negative sign to input
    if (input) { // if there is input
        if (input.charAt(0) === '-') { // if start of input is a negative sign
            input = input.slice(1); // removes the negative sign if it's already there
        } else { // otherwise
            input = `-${input}`; // adds a negative sign
        }
        document.getElementById('display').value = input;
    }
}

function updateHistory(equation, result) { // this function updates the history 
    if (equation !== 'Error') { // if not an error
        history += `${equation} = ${result}<br>`; // add equation to history followed by a line break
        document.getElementById('history').innerHTML = history;
    }
}

function clearHistory() { // this function clears the history
    history = ''; // sets history to an empty string
    document.getElementById('history').innerHTML = history;
}

function changeTheme() { // function to swap between light theme and dark theme
    theme = theme === 'light-theme' ? 'dark-theme' : 'light-theme'; // using a ternary operator to swap between light and dark theme
    document.body.className = theme;

    const buttons = document.querySelectorAll('.calculator-button'); // gets the calculator buttons
    const display = document.getElementById('display'); // gets the calculator display
    const historyWindow = document.getElementById('history'); // gets the calculator history window

    buttons.forEach(button => { // for each calculator button 
        // changes the styles for the display depending on light or dark theme
        button.style.backgroundColor = theme === 'dark-theme' ? '#333' : '#fff'; 
        button.style.color = theme === 'dark-theme' ? '#fff' : '#000';
    });

    // changes the styles for the display depending on light or dark theme
    display.style.backgroundColor = theme === 'dark-theme' ? '#333' : '#fff';
    display.style.color = theme === 'dark-theme' ? '#fff' : '#000';
    // changes the styles for the history window depending on light or dark theme
    historyWindow.style.backgroundColor = theme === 'dark-theme' ? '#333' : '#fff';
    historyWindow.style.color = theme === 'dark-theme' ? '#fff' : '#000';
}

function calculate() { // this is the calculate function
    try { // try statement
        const equation = input; // sets equation to input
        const doubleNeg = input.replace('--', ''); // this will handle the double negative sign

        let result = checkParentheses(doubleNeg);

        if (!isNaN(result)) { // if result is a number 
            updateHistory(equation, result); // updates history
            input = result.toString(); // input becomes the result
        } else { // otherwise
            input = 'Error'; // displays an error message
        }

        document.getElementById('display').value = input; // Update the display with the result or 'Error'.
    } catch (error) { // catches an error
        input = 'Error'; // input will display an error message
        document.getElementById('display').value = input;
    }
}

function allClear() { // this function handles clearing user input
    input = ''; // sets input to an empty string
    document.getElementById('display').value = ''; // updates the display
    history += '-------clear-------<br>'; // Add the separator to the history
    document.getElementById('history').innerHTML = history; // Update the history display 
}

function checkParentheses(equation) {  // this function checks for whitespace and if numbers are directly outside of parentheses for multiplication
    equation = equation.replace(/\s/g, ''); // this removes white spaces from the inputted equation string
    equation = equation.replace(/(\d)\(/g, '$1*('); // when a number is directly in front of left parentheses, add * between them so it works like a real calculator
    equation = equation.replace(/\)(\d)/g, ')*$1'); // when a number is directly after right parenthesis, add * between them so it works like a real calculator
    return operations(Array.from(equation), 0); // makes equation into an array starting at index 0 to be used in operations function and returns it
}

function operations(string, index) { // this function handles parentheses and the basic calculator operations
    let value = 0; // set value to 0
    let operator = '+'; // sets the operator to +
    var stack = []; // sets stack to an empty stack

    for (let i = index; i < string.length; i++) { // for all indexes of string length
        let character = string[i]; // let character equal the current index in the string

        if (character >= '0' && character <= '9') { // if the character is between 0 and 9
            value = value * 10 + parseInt(character, 10); // value is multiplied by 10 and character parsed as an integer with a base value of 10 is added onto the number. 
        }

        if (!(character >= '0' && character <= '9') || i === string.length - 1) { // character doesn't equal a number between 0 and 9 or is at the end of the string. If the character is not part of the number

            if (character === '(') { // if the character is a left parenthesis
                value = operations(string, i + 1); // recursively calls parentheses with one added to the index of the string 

                let left = 1; // sets a to 1. left parentheses
                let right = 0; // sets b to 0. right parentheses

                for (let j = i + 1; j < string.length; j++) { // for index j equals i plus 1, go through all indexes in the string, the inside of this loop will keep track of parentheses to make sure they are properly closed and the count of left equals right

                    if (string[j] === ')') { // if index j of the string is a right parenthesis
                        right++; // add to the count of right parenthesis

                        if (right === left) { // if the count of right parenthesis equals the count of left parentheses
                            i = j; // index i equals index j and the parentheses are closed
                            break; // breaks from the loop
                        }

                    } else if (string[j] === '(') { // if index j of the string is an additional left parenthesis
                        left++; // add to the count of left parentheses
                    }
                }
            }
            // here are the basic operations for the calculator, might make this its own function at some point for clarity's sake
            let previous = -1; // sets the previous to -1, for multiplication and division purposes

            if (operator === '+') { // if the operator is +
                stack.push(value);
            } else if (operator === '-') { // else if the operator is -, push a negative value to the stack to handle subtraction
                stack.push(-value);
            } else if (operator === '*') { // else if the operator is *, sets the previous to the value popped off the stack, then pushes the previous multiplied by the value to the stack to handle multiplication 
                previous = stack.pop();
                stack.push(previous * value);
            } else if (operator === '/') { // else if the operator is /, sets the previous to the value popped off the stack, then pushes the previous divided by the value to handle division
                previous = stack.pop();
                stack.push(previous / value);
            }
            operator = character; // sets the operator to the character
            value = 0; // sets the value to 0

            if (character === ')') { // if the character is a right parenthesis
                break; // break to exit the inner loop
            }    
        } 
    } // end for loop
    let result = 0; // sets the result to 0 

    while (stack.length > 0) { // while the stack length is greater than 0
        result += stack.pop(); // pops an element from the stack and adds it to the result
    }
    return result; // returns the result 
}

document.addEventListener('DOMContentLoaded', function () {

    function addButtonListener(buttonId, charFunction) {
        document.getElementById(buttonId).addEventListener('click', function () {
            charFunction();
        });
    }

    addButtonListener('button-1', function () { inputChar('1'); });
    addButtonListener('button-2', function () { inputChar('2'); });
    addButtonListener('button-3', function () { inputChar('3'); });
    addButtonListener('button-4', function () { inputChar('4'); });
    addButtonListener('button-5', function () { inputChar('5'); });
    addButtonListener('button-6', function () { inputChar('6'); });
    addButtonListener('button-7', function () { inputChar('7'); });
    addButtonListener('button-8', function () { inputChar('8'); });
    addButtonListener('button-9', function () { inputChar('9'); });
    addButtonListener('button-0', function () { inputChar('0'); });

    addButtonListener('button-plus', function () { inputChar('+'); });
    addButtonListener('button-minus', function () { inputChar('-'); });
    addButtonListener('button-multiply', function () { inputChar('*'); });
    addButtonListener('button-divide', function () { inputChar('/'); });
    addButtonListener('button-leftPar', function () { inputChar('('); });
    addButtonListener('button-rightPar', function () { inputChar(')'); });

    addButtonListener('button-equals', function () { calculate(); });
    addButtonListener('button-AC', function () { allClear(); });
    addButtonListener('button-negSign', function () { negSign(); });

    addButtonListener('button-changeTheme', function () { changeTheme(); });
    addButtonListener('button-clearHistory', function () { clearHistory(); });
});


