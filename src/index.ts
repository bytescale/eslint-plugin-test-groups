import { Rule } from "eslint";

// Tips:
// - Open https://astexplorer.net/
//   - Set language 'JavaScript'
//   - Set parser to '@typescript-eslint/parser'
//   - Paste some code in (that you want to observe the AST of)
// - Return a method named 'X' from 'create' below, where 'X' is the node type you're interested in visiting.
// - Use 'context.report' to report rule violations.
export const rules: Record<string, Rule.RuleModule> = {
  "require-groups-for-tests": {
    meta: {
      type: "problem",
      fixable: undefined,
      schema:[{
        type: 'object',
        properties: {
          groupWhitelist: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false
      }]
    },
    create(context: Rule.RuleContext) {
      const sourceCode = context.getSourceCode();
      const options = context.options[0] ?? {};
      const whitelistKey = "groupWhitelist"
      const whitelist: string[] = options[whitelistKey] ?? [];
      let describeFound = false;

      return {
        CallExpression(node) {
          if (node.callee.type === "Identifier" && node.callee.name === 'describe') {
            describeFound = true;
          }
        },
        'Program:exit'() {
          if (!describeFound) {
            return; // Exit early if no describe blocks found
          }

          const comments = sourceCode.getAllComments();
          const blockComments = comments.filter(comment => comment.type === 'Block' && comment.value.includes('@group'));

          if (blockComments.length === 0) {
            context.report({
              node: sourceCode.ast,
              message: 'Test file is missing a "@group" block comment.',
            });
            return;
          }

          const blockComment = blockComments[0]
          const matches = blockComment.value.match(/@group\s+(\S+)/);

          if (matches === null) {
            context.report({
              node: sourceCode.ast,
              message: `First comment block in a test must contain a @group attribute.`,
            });
            return;
          }

          if (!whitelist.includes(matches[1])) {
            context.report({
              node: sourceCode.ast,
              message: `The @group value "${matches[1]}" is not whitelisted. See the '${whitelistKey}' field in '.eslintrc.yaml'.`,
            });
          }
        }
      };
    }
  }
};
