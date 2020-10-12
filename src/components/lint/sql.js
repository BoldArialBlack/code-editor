// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Depends on sqlLint.js from https://github.com/zaach/sqlLint

// declare global: sqlLint
import CodeMirror from 'codemirror';

(function (factory) {
  if (typeof exports === 'object' && typeof module === 'object') { // CommonJS
    factory(require('codemirror'));
  } else if (typeof define === 'function' && define.amd) { // AMD
    define(['codemirror'], factory);
  } else { // Plain browser env
    factory(CodeMirror);
  }
})(function (CodeMirror) {
  'use strict';

  CodeMirror.registerHelper('lint', 'sql', function (text) {
    var found = [];
    if (!window.sqlLint) {
      if (window.console) {
        window.console.log('Error: window.sqlLint not defined, CodeMirror sql linting cannot run.');
      }
      return found;
    }
    // for sqlLint's web dist sqlLint is exported as an object with a single property parser, of which parseError
    // is a subproperty
    var sqlLint = window.sqlLint.parser || window.sqlLint;

    sqlLint.processError = function (err) {
      let {message, location, loc, expected, text, hash} = err;
      // console.log(err, message, location, hash, loc, text);
      if (location) {
        found.push({from: CodeMirror.Pos(location.start.line - 1, location.start.column - 1),
          to: CodeMirror.Pos(location.end.line - 1, location.end.column - 1),
          message: message});
        return;
      }
      // var loc = hash.loc;
      if (!loc && hash) {
        loc = hash.loc;
        expected = hash.expected;
        text = hash.text;
      }
      if (!loc) return;
      found.push({from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
        to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
        message: message || text || expected.length ? ('Expected ' + (expected || []).map(o => `${o.text ? `"${o.text}"` : `${o}`}`).join(', ') + ', but \"' + (text) + '\" found.') : 'Invalid'
      });
    };

    const method = sqlLint.parse || sqlLint.astify;

    if (method) {
      try { method(text); } catch (e) { sqlLint.processError(e); }
      return found;
    }
    try { let err = sqlLint.parseSyntax(text); if (err) throw err; } catch (e) { sqlLint.processError(e); }
    return found;
  });

  return CodeMirror;
});
