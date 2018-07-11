<p align="center"><img src="https://user-images.githubusercontent.com/8137136/42549502-16b26662-84ff-11e8-945e-3bac8a1a0672.png" alt="Vue logo"></p>
<br>

A lint configs initiator, extracted from [bio](https://github.com/weidian-inc/bio-cli).

```
linit = eslint + tslint + prettier + stylelint + husky + lint-staged
```
## Usage
Just execute this command under your project's root directory.
```
npx linit
```

## Feature

- node/vue/typescript supported
- auto fix all fixable rules
- forgive unfixable rules (don't forget to fix them with your editor's lint suggestion)
- after first init, it will automatically init on other people's computer