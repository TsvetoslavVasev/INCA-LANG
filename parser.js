var exports = module.exports = {};

// exports.Parser = function Parser(input) {
//     var PRECEDENCE = {
//         "=": 1,
//         "||": 2,
//         "&&": 3,
//         "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
//         "+": 10, "-": 10,
//         "*": 20, "/": 20, "%": 20,
//     };
//     return parse_toplevel();
//     return parse_toplevel();
//     function is_punc(ch) {
//         var tok = input.peek();
//         return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
//     }
//     function is_kw(kw) {
//         var tok = input.peek();
//         return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
//     }
//     function is_op(op) {
//         var tok = input.peek();
//         return tok && tok.type == "op" && (!op || tok.value == op) && tok;
//     }
//     function skip_punc(ch) {
//         if (is_punc(ch)) input.next();
//         else input.croak("Expecting punctuation: \"" + ch + "\"");
//     }
//     function skip_kw(kw) {
//         if (is_kw(kw)) input.next();
//         else input.croak("Expecting keyword: \"" + kw + "\"");
//     }
//     function skip_op(op) {
//         if (is_op(op)) input.next();
//         else input.croak("Expecting operator: \"" + op + "\"");
//     }
//     function unexpected() {
//         input.croak("Unexpected token: " + JSON.stringify(input.peek()));
//     }
//     function parse_lambda() {
//         return {
//             type : "func",
//             vars : delimited("(",")", ",", parse_varname),
//             body : parse_expression()
//         }
//     }
//     function delimited(start, stop, separator, parser) {
//         var a = [];
//         var first = true;
//         skip_punc(start);
//         while(!input.eof()) {
//             if (is_punc(stop)) break;
//             if (first) first = false; else skip_punc(separator);
//             if (is_punc(stop)) break; // the last seperator can be missing??
//             a.push(parser())
//         }
//         skip_punc(stop);
//         return a;
//     }
//     function parse_toplevel() {
//         var program = [];
//         while (!input.eof()) {
//             program.push(parse_expression());
//             if (!input.eof()) {
//                 skip_punc(";");
//             }
//         }
//         return {
//             type : "prog",
//             prog : program
//         }
//     }
//     function parse_if() {
//         skip_kw("if");
//         var condition = parse_expression();
//         if (!is_punc("{")) {
//             skip_kw("then");
//         }
//         var then = parse_expression();
//         var res = {
//             type : "if",
//             cond : condition,
//             then : then
//         }
//         if (is_kw("else")) {
//             input.next()
//             res.else = parse_expression();
//         }
//     }
//     function parse_atom() {
//         return maybe_call(function(){
//             if (is_punc("(")) {
//                 input.next();
//                 var expr = parse_expression();
//                 skip_punc(")");
//                 return expr;
//             }
//             if (is_punc("{")) {
//                 return parse_prog();
//             }
//             if (is_kw("if")) {
//                 return parse_if();
//             }
//             if (is_kw("true") || is_kw("false")) {
//                 return parse_bool();
//             }
//             if (is_kw("func")) {
//                 input.next();
//                 return parse_lambda();
//             }
//             var token = input.next();
//             if (token.type == "var" || token.type == "num" || token.type == "str") {
//                 return token;
//             }
//             unexpected();
//         });
//     }
//     var FALSE = { type: "bool", value: false };
    
//     function parse_prog() {
//         var program = delimited("{", "}", ";", parse_expression)
//         if (program.lenth == 0) {
//             return FALSE;
//         } else if (program.length == 1) {
//             return program[0];
//         }
//         return {
//             type : "program",
//             prog : program
//         };
//     }
    
//     function parse_expression() {
//         return maybe_call(function() {
//             return maybe_binary(parse_atom(), 0);
//         })
//     }
//     //razuchi
//     function maybe_call(expr) {
//         expression = expr();
//         return is_punc("(") ? parse_call(expression) : expression;
//     }
//     function parse_call(func) {
//         return {
//             type : "call",
//             func : func,
//             args : delimited("(", ")", ",", parse_expression)
//         }
//     }
//     function parse_varname() {
//         var name = input.next();
//         if (name.type != "var") {
//             input.croak("Expecting variable name")
//         }
//         return name.value;
//     }
//     function parse_bool() {
//         return {
//             type : "bool",
//             value : input.next().value == "true"
//         }
//     }
//     function maybe_binary(left, my_precedence) {
//         var token = is_op();
//         if (token) {
//             var his_precedence = PRECEDENCE[token.value];
//             if (his_precedence > my_precedence) {
//                 input.next();
//                 var right = maybe_binary(parse_atom(), his_precedence) // (*)
//                 var binary = {
//                     type : token.value == "=" ? "assign" : "binary",
//                     operator : token.value,
//                     left : left,
//                     right : right
//                 }
//                 return maybe_binary(binary, my_precedence);
//             }
//         }
//         return left;
//     }
// }

exports.Parser = function Parser(input) {
    var PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };
    var FALSE = { type: "bool", value: false };
    return parse_toplevel();
    function is_punc(ch) {
        var tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }
    function is_kw(kw) {
        var tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }
    function is_op(op) {
        var tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }
    function skip_punc(ch) {
        if (is_punc(ch)) input.next();
        else input.croak("Expecting punctuation: \"" + ch + "\"");
    }
    function skip_kw(kw) {
        if (is_kw(kw)) input.next();
        else input.croak("Expecting keyword: \"" + kw + "\"");
    }
    function skip_op(op) {
        if (is_op(op)) input.next();
        else input.croak("Expecting operator: \"" + op + "\"");
    }
    function unexpected() {
        input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }
    function maybe_binary(left, my_prec) {
        var tok = is_op();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybe_binary({
                    type     : tok.value == "=" ? "assign" : "binary",
                    operator : tok.value,
                    left     : left,
                    right    : maybe_binary(parse_atom(), his_prec)
                }, my_prec);
            }
        }
        return left;
    }
    function delimited(start, stop, separator, parser) {
        var a = [], first = true;
        skip_punc(start);
        while (!input.eof()) {
            if (is_punc(stop)) break;
            if (first) first = false; else skip_punc(separator);
            if (is_punc(stop)) break;
            a.push(parser());
        }
        skip_punc(stop);
        return a;
    }
    function parse_call(func) {
        return {
            type: "call",
            func: func,
            args: delimited("(", ")", ",", parse_expression),
        };
    }
    function parse_varname() {
        var name = input.next();
        if (name.type != "var") input.croak("Expecting variable name");
        return name.value;
    }
    function parse_if() {
        skip_kw("if");
        var cond = parse_expression();
        if (!is_punc("{")) skip_kw("then");
        var then = parse_expression();
        var ret = {
            type: "if",
            cond: cond,
            then: then,
        };
        if (is_kw("else")) {
            input.next();
            ret.else = parse_expression();
        }
        return ret;
    }
    function parse_lambda() {
        return {
            type: "func",
            vars: delimited("(", ")", ",", parse_varname),
            body: parse_expression()
        };
    }
    function parse_bool() {
        return {
            type  : "bool",
            value : input.next().value == "true"
        };
    }
    function maybe_call(expr) {
        expr = expr();
        return is_punc("(") ? parse_call(expr) : expr;
    }
    function parse_atom() {
        return maybe_call(function(){
            if (is_punc("(")) {
                input.next();
                var exp = parse_expression();
                skip_punc(")");
                return exp;
            }
            if (is_punc("{")) return parse_prog();
            if (is_kw("if")) return parse_if();
            if (is_kw("true") || is_kw("false")) return parse_bool();
            if (is_kw("func")) {
                input.next();
                return parse_lambda();
            }
            var tok = input.next();
            if (tok.type == "var" || tok.type == "num" || tok.type == "str")
                return tok;
            unexpected();
        });
    }
    function parse_toplevel() {
        var prog = [];
        while (!input.eof()) {
            prog.push(parse_expression());
            if (!input.eof()) skip_punc(";");
        }
        return { type: "prog", prog: prog };
    }
    function parse_prog() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: "prog", prog: prog };
    }
    function parse_expression() {
        return maybe_call(function(){
            return maybe_binary(parse_atom(), 0);
        });
    }
}