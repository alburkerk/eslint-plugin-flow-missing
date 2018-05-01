/**
 * @fileoverview Is // @flow at the start of each of your files
 * @author alburkerk
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const headerFlow = " @flow";

function getTopComments(context, node) {
  return node.body.length
    ? context.getComments(node.body[0]).leading // leading for top of the node (trailing for bottom)
    : context.getComments(node).leading;
}

function ignoreNoJsFiles(filename) {
  var splittedName = filename.split(".");
  return splittedName[splittedName.length - 1] !== "js";
}

function isLineCommentWithFlowInIt(commentsArray) {
  return (
    commentsArray.findIndex(
      comment => comment.type === "Line" && comment.value === headerFlow
    ) > -1
  );
}

function isLineComment(commentsArray) {
  return commentsArray.findIndex(comment => comment.type === "Line") > -1;
}

function fixAjout(node) {
  return function(fixer) {
    return fixer.insertTextBefore(node, "//" + headerFlow + "\n");
  };
}

function fixModification(context, leadingComments) {
  return function(fixer) {
    const inlineComment =
      leadingComments[
        leadingComments.findIndex(comment => comment.type === "Line")
      ];
    return fixer.replaceTextRange(
      [inlineComment.range[0], inlineComment.range[1]],
      "//" + headerFlow
    );
  };
}

module.exports = {
  meta: {
    docs: {
      description: "Is // @flow at the start of each of your files",
      category: "Possible Errors",
      recommended: false,
      url: "https://github.com/alburkerk/eslint-plugin-flow-missing"
    },
    fixable: "code",
    schema: [] // no options
  },
  create: function(context) {
    return {
      // Returns Node containing the whole program (root node of the AST)
      Program: function(node) {
        if (ignoreNoJsFiles(context.getFilename())) {
          return;
        }

        const leadingComments = getTopComments(context, node);

        if (isLineCommentWithFlowInIt(leadingComments)) {
          return;
        }

        if (isLineComment(leadingComments)) {
          context.report({
            loc: node.loc,
            message: "Missing // @flow at the start of the file",
            fix: fixModification(context, leadingComments)
          });
        } else {
          context.report({
            loc: node.loc,
            message: "Missing // @flow at the start of the file",
            fix: fixAjout(node)
          });
        }
      }
    };
  }
};
