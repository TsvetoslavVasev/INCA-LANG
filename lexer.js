var exports = module.exports = {};

// exports.InputStream = function InputStream(input) {
//     var pos = 0
//     var line = 1
//     var col = 0

//     return {
//         next : next,
//         peek : peek,
//         eof : eof,
//         croak : croak
//     }

//     function next() {
//         var ch = input.charAt(pos++);
//         if(ch == "\n") {
//             line++
//             col = 0;
//         } else {
//             col++;
//         }
//         return ch;
//     }
//     function peek() {
//         return input.charAt(pos);
//     }
//     function eof() {
//         return this.peek() == "";
//     }
//     function croak(msg) {
//         throw new Error(msg + " (" + line + ":" + col +") ");
//     }
// }


// exports.Lexer = function Lexer(input) {

//     // { type: "punc", value: "(" }           // punctuation: parens, comma, semicolon etc.
//     // { type: "num", value: 5 }              // numbers
//     // { type: "str", value: "Hello World!" } // strings
//     // { type: "kw", value: "lambda" }        // keywords
//     // { type: "var", value: "a" }            // identifiers
//     // { type: "op", value: "!=" }            // operators

//     var current = null // zashto??
//     // we need to put the keywords to be empty space separated from both sides
//     var keywords = " if then else true false func "
//     return {
//         next : next,
//         peek : peek,
//         eof : eof,
//         croak : input.croak
//     }
//     function is_keyword(word) {
//         return keywords.indexOf(" " + word + " ") >= 0;
//     }
//     function is_digit(ch) {
//         return /[0-9]/i.test(ch); // check with regex
//     }
//     function is_id_start(ch) {
//         return /[a-z_]/i.test(ch);
//     }
//     function is_id(ch) {
//         return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
//     }
//     function is_op_char(ch) {
//         return "+-*/%=&|<>!".indexOf(ch) >= 0;
//     }
//     function is_punc(ch) {
//         return ",;(){}[]".indexOf(ch) >= 0;
//     }
//     function is_whitespace(ch) {
//         return " \t\n".indexOf(ch) >= 0;
//     }
//     // nerazbiram tochno
//     function read_while(predicate) {
//         var string = "";
//         while (!input.eof() && predicate(input.peek())) {
//             string += input.next();
//         }
//         return string;
//     }
//     function read_number() {
//         var contains_dot = false;
//         var num = read_while(function(ch) {
//             if(ch == ".") {
//                 contains_dot = true;
//                 return true;
//             }
//             return is_digit(ch);
//         });
//         return {
//             type : "num",
//             value : parseFloat(num)
//         };
//     }
//     function read_ident() {
//         var id = read_while(is_id);
//         var type;
//         if (is_keyword(id)) {
//             type = "kw";
//         } else {
//             type = "var"
//         }
//         return {
//             type : type,
//             value : id
//         }
//     }
//     // add support for escaping strings
//     // vij kak raboti
//     function read_escaped(end) {
//         var escaped = false;
//         var string = "";
//         input.next();
//         while (!input.eof()) {
//             var ch = input.next();
//             if (ch == "\\") {
//                 escaped = true;
//             } else if (ch == end) {
//                 break;
//             } else {
//                 string += ch;
//             }
//         }
//         return string;
//     }
//     function read_string() {
//         val = read_escaped('"');
//         return {
//             type : "str",
//             val : val
//         };
//     }
//     function skip_comment() {
//         read_while(function(ch) {
//             return ch != "\n"
//         });
//         input.next();
//     }
//     function read_next() {
//         read_while(is_whitespace);
//         if(input.eof()) return null;
//         var ch = input.peek();
//         if (ch == "#") {
//             skip_comment();
//             return read_next();
//         }
//         if (ch == '"') {
//             read_string();
//         }
//         if (is_digit(ch)) return read_number();
//         if (is_id_start(ch)) return read_ident();
//         if (is_punc(ch)) {
//             return {
//                 type : "punc",
//                 value : input.next()
//             }
//         }
//         if (is_op_char(ch)) {
//             return {
//                 type : "op",
//                 value : read_while(is_op_char)
//             }
//         }
//         input.croak("Could not resolve character " + ch);
//     }
//     // zashto izpol current
//     function peek() {
//         if (current != null) {
//             return current;
//         } else {
//             current = read_next();
//         }
//         return current;
//     }
//     function next() {
//         var token = current;
//         current = null;
//         return token || read_next(); // zashto ||
//     }
//     function eof() {
//         return peek() == null;
//     }
// }

exports.InputStream = function InputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        return ch;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}

exports.Lexer = function Lexer(input) {
    var current = null;
    var keywords = " if then else func true false ";
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : input.croak
    };
    function is_keyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }
    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }
    function is_id_start(ch) {
        return /[a-z_]/i.test(ch);
    }
    function is_id(ch) {
        return is_id_start(ch) || "?!<>=0123456789".indexOf(ch) >= 0;
    }
    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }
    function is_punc(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }
    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    function read_number() {
        var has_dot = false;
        var number = read_while(function(ch){
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });
        return { type: "num", value: parseFloat(number) };
    }
    function read_ident() {
        var id = read_while(is_id);
        return {
            type  : is_keyword(id) ? "kw" : "var",
            value : id
        };
    }
    function read_escaped(end) {
        var escaped = false, str = "";
        input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }
    function read_string() {
        return { type: "str", value: read_escaped('"') };
    }
    function skip_comment() {
        read_while(function(ch){ return ch != "\n" });
        input.next();
    }
    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        if (ch == "#") {
            skip_comment();
            return read_next();
        }
        if (ch == '"') return read_string();
        if (is_digit(ch)) return read_number();
        if (is_id_start(ch)) return read_ident();
        if (is_punc(ch)) return {
            type  : "punc",
            value : input.next()
        };
        if (is_op_char(ch)) return {
            type  : "op",
            value : read_while(is_op_char)
        };
        input.croak("Can't handle character: " + ch);
    }
    function peek() {
        return current || (current = read_next());
    }
    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }
    function eof() {
        return peek() == null;
    }
}