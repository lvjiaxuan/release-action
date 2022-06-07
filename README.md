# release-action

 [Create a release](https://docs.github.com/en/rest/releases/releases#create-a-release) by GitHub action.

## Inputs

see [action.yml](./action.yml)

## Example usage

*/github/workflows/release-ci.yml*:
```yml
name: 'Create a release'

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: lvjiaxuan/release-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> [`secrets.GITHUB_TOKEN` is created automatically](https://docs.github.com/cn/actions/security-guides/automatic-token-authentication)

## [Node.js packages publish](https://docs.github.com/cn/actions/publishing-packages/publishing-nodejs-packages)

### Setting NPM Token

1. Create your own npm token first: https://www.npmjs.com/settings/{yourname}/tokens
1. Set to GitHub Repo: [repo] -> settings -> secrets

```yml
- uses: actions/setup-node@v2
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }} # setup-node 自动引用,用于创建 *.npmrc*
  with:
    node-version: 16 # ${{ matrix.node }}
    cache: npm
```

### *package.json*

```json
{
  "name": "包名",
  "version": "0.0.1",
  "description": "描述"
}
```

### Specify registry target

Way1: Specify `registry-url` prop in *actions/setup-node*.
```yml
- uses: actions/setup-node@v2
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }} # setup-node 自动引用,用于创建 *.npmrc*
  with:
    node-version: 16 # ${{ matrix.node }}
    registry-url: https://registry.npmjs.org # or https://npm.pkg.github.com(uses env.GITHUB_TOKEN)
    cache: npm
```

Way2: Specify `publishConfig` prop in *package.json*.
```json
{
  "publishConfig": {
    "tag": "latest",
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  }
}
```

Way2 gets higher priority than Way1.
