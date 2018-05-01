/**
 * @fileoverview Is // @flow at the start of each of your files
 * @author alburkerk
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/flow-start-file");
var fs = require("fs");

RuleTester = require("eslint").RuleTester;

var example_good = fs.readFileSync(
  "./tests/lib/testFiles/example-good.js",
  "utf8"
);
var example_block_comment_before = fs.readFileSync(
  "./tests/lib/testFiles/example-block-comment-before.js",
  "utf8"
);
var example_no_flow = fs.readFileSync(
  "./tests/lib/testFiles/example-no-flow.js",
  "utf8"
);
var example_no_space = fs.readFileSync(
  "./tests/lib/testFiles/example-no-space.js",
  "utf8"
);
var example_not_js_file = fs.readFileSync(
  "./tests/lib/testFiles/example-not-js-file.php",
  "utf8"
);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({});

ruleTester.run("flow-start-file", rule, {
  valid: [
    {
      code: example_good,
      filename: "example-good.js"
    },
    {
      code: example_block_comment_before,
      filename: "example-block-comment-before.js"
    },
    {
      code: example_not_js_file,
      filename: "example-not-js-file.js.php",
      errors: [
        {
          message: "Missing // @flow at the start of the file"
        }
      ]
    }
  ],

  invalid: [
    {
      code: example_no_space,
      filename: "example-no_space.js",
      errors: [
        {
          message: "Missing // @flow at the start of the file"
        }
      ]
    },
    {
      code: example_no_flow,
      filename: "example-no-flow.js",
      errors: [
        {
          message: "Missing // @flow at the start of the file"
        }
      ]
    }
  ]
});
