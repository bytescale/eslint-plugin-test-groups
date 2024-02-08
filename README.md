## ESLint Rule: `require-groups-for-tests`

Requires return types on lambdas that return object literals.

### Installation

```bash
npm install --save-dev eslint-plugin-test-groups
```

**.eslintrc.yaml:**

```yaml
root: true
parser: "@typescript-eslint/parser"
parserOptions:
  project: "./tsconfig.json"
plugins:
  - "@typescript-eslint"
  - "return-types-object-literals" # ← Add this
rules:
  # ↓ And this:
  "return-types-object-literals/require-groups-for-tests": error
```

### Examples

```typescript
/**
 * If the 'group' attribute is not declared, then this ESLint rule will return an error.
 *
 * Furthermore, the 'group' attribute must match one the configured groups for the rule (you define these).
 *
 * @group some-test-group
 */
describe("Some Tests", () => {

})
```

### Benefits

Ensures every test is assigned to a group.

Restricting the groups to known values allows you to easily keep your CI pipelines in sync, for example, if you're running tests in parallel and need to list each group individually in your CI config.

### Credits

The following resources were very useful when writing this plugin:

- [Writing custom TypeScript ESLint rules: How I learned to love the AST](https://dev.to/alexgomesdev/writing-custom-typescript-eslint-rules-how-i-learned-to-love-the-ast-15pn)
- [AST Explorer](https://astexplorer.net/)
  - Set language 'JavaScript'
  - Set parser to '@typescript-eslint/parser'

### License

[MIT](LICENSE)
