var lex = require('./lexer.js');
var parse = require('./parser.js');
var interpreter = require('./interpreter.js');

function Environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}
Environment.prototype = {
    extend: function() {
        return new Environment(this);
    }, 
    lookup : function(name) {
        var scope = this;
        while(scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
                return scope;
            }
            scope = scope.parent;
        }
    },
    get : function(name) {
        if (name in this.vars) {
            return this. vars[name];
        }
        throw new Error("Undefined variable " + name);
    },
    set : function(name, value) {
        var scope = this.lookup(name);
        if (scope && this.parent) {
            throw new Error("Undefined variable " + name);
        }
        return (scope || this).vars[name] = value;
    },
    def : function(name, value) {
        return this.vars[name] = value;
    }
}

// create the global environment
var globalEnv = new Environment();
// define the "print" primitive function
globalEnv.def("print", function(txt){
    console.log(txt);
  });
  
// var example1 = lex.InputStream(`power = func(x, n) if n == 0 then 1 else  x * power( x ,n-1); print(power(2,3))`);
// var example2 = lex.InputStream(`fib = func(n) if n < 2 then n else (n - 1); print(fib(4))`);
// var example3 = lex.InputStream(`fact = func(n) if n == 0 || n == 1 then 1 else n*fact(n-1); print(fact(5))`);
// var lexer = lex.Lexer(example3);
// var ast = parse.Parser(lexer);
// evaluate(ast, globalEnv); 

// var prompt = require('prompt');
//   prompt.start();
//   prompt.get(['$'], function (err, result) {
//     var text = lex.InputStream(result.$);
//     var lexer = lex.Lexer(text);
//     var ast = parse.Parser(lexer);
//     evaluate(ast, globalEnv);
//   });

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var promptLoop = function () {
  rl.question('$ (INCA interpreter v0.1.0): ', function (input) {
    if (input == 'exit' || input == '\n' || input == '\r\n')  {
        return rl.close();
    }
    var text = lex.InputStream(input);
    var lexer = lex.Lexer(text);
    var ast = parse.Parser(lexer);
    interpreter.Eval(ast, globalEnv);
    promptLoop(); //Calling this function again to ask new question
  });
};

promptLoop();