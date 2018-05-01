/**
 * @fileoverview Is // @flow at the start of each of your files
 * @author alburkerk
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  meta: {
    docs: {
      description: "Is // @flow at the start of each of your files",
      category: "Possible Errors",
      recommended: false,
      url: "http://google.com"
    },
    fixable: "code",
    schema: [] // no options
  },
  create: function(context) {
    function getTopComments(context, node) {
      return node.body.length
        ? context.getComments(node.body[0]).leading // leading for top of the node (trailing for bottom)
        : context.getComments(node).leading;
    }

    // Ignore stuff like #!/bin/sh, even if it should not he usefull here
    function ignoreHashBangs(comments) {
      return comments.filter(comment => comment.type !== "Shebang");
    }

    function ignoreNoJsFiles(filename) {
      var splittedName = filename.split(".");
      return splittedName[splittedName.length - 1] !== "js";
    }

    function isLineCommentWithFlowInIt(commentsArray) {
      return (
        commentsArray.findIndex(
          comment => comment.type === "Line" && comment.value === " @flow"
        ) > -1
      );
    }

    return {
      // Returns Node containing the whole program (root node of the AST)
      Program: function(node) {
        if (ignoreNoJsFiles(context.getFilename())) {
          return;
        }

        const leadingComments = ignoreHashBangs(getTopComments(context, node));

        if (isLineCommentWithFlowInIt(leadingComments)) {
          return;
        } else {
          context.report({
            loc: node.loc,
            message: "Missing // @flow at the start of the file"
          });
        }
      }
    };
  }
};
