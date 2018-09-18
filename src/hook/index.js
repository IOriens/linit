const fs = require("fs-extra");
const path = require("path");
const { red } = require("chalk");

const VERSION_FILE = "version.json";
const HOOKS_DIRNAME = "hooks";
const HOOKS_OLD_DIRNAME = "hooks.old";

const HOOKS = [
  "applypatch-msg",
  "commit-msg",
  "post-applypatch",
  "post-checkout",
  "post-commit",
  "post-merge",
  "post-receive",
  "pre-applypatch",
  "pre-auto-gc",
  "pre-commit",
  "pre-push",
  "pre-rebase",
  "pre-receive",
  "prepare-commit-msg",
  "update",
  VERSION_FILE
];

/**
 * Returns the closest git directory.
 * It starts looking from the current directory and does it up to the fs root.
 * It returns undefined in case where the specified directory isn't found.
 *
 * @param {String} [currentPath] Current started path to search.
 * @returns {String|undefined}
 */
function getClosestGitPath(currentPath = process.cwd()) {
  const dirnamePath = path.join(currentPath, ".git");

  if (fs.pathExistsSync(dirnamePath)) {
    return dirnamePath;
  }

  const nextPath = path.resolve(currentPath, "..");

  if (nextPath === currentPath) {
    return undefined;
  }

  return getClosestGitPath(nextPath);
}

/**
 * if version is up to date, return false
 * if version is too old or versionFile doesn't exist, return true
 * @param {any} templatePath hooks templates
 * @param {any} gitPath hooks installation path
 * @returns {boolean}
 */
function needInstall(templatePath, gitPath) {
  const hooksPath = path.resolve(gitPath, HOOKS_DIRNAME);
  const hooksOldPath = path.resolve(gitPath, HOOKS_OLD_DIRNAME);
  const destVerFile = path.resolve(hooksPath, VERSION_FILE);
  const srcVerFile = path.resolve(templatePath, VERSION_FILE);

  if (fs.pathExistsSync(destVerFile)) {
    const destVer = JSON.parse(fs.readFileSync(destVerFile)).version;
    const srcVer = JSON.parse(fs.readFileSync(srcVerFile)).version;
    if (destVer < srcVer) {
      console.log("正在更新 Hook 文件");
    } else {
      console.log("Hook 文件已经是最新的");
      return false;
    }
  } else {
    if (fs.pathExistsSync(hooksPath) && !fs.pathExistsSync(hooksOldPath)) {
      fs.renameSync(hooksPath, hooksOldPath);
    }
    console.log("Hook 设置完成");
  }
  return true;
}

/**
 * copy hook templates to gitpath
 *
 * @param {any} templatePath
 * @param {any} gitPath
 */
function writeHookFiles(templatePath, gitPath) {
  if (!gitPath) {
    throw new Error("hooks must be added inside a git repository");
  }

  const hooksPath = path.resolve(gitPath, HOOKS_DIRNAME);
  fs.ensureDirSync(hooksPath);
  HOOKS.forEach(hookName => {
    const hookSrcPath = path.resolve(templatePath, hookName);
    const hookDestPath = path.resolve(hooksPath, hookName);
    if (fs.pathExistsSync(hookSrcPath)) {
      try {
        fs.writeFileSync(hookDestPath, fs.readFileSync(hookSrcPath), {
          mode: "0777"
        });
      } catch (e) {
        // node 0.8 fallback
        fs.writeFileSync(hookDestPath, fs.readFileSync(hookSrcPath), "utf8");
        fs.chmodSync(hookDestPath, "0777");
      }
    }
  });
}

const oldAddHook = ({ preHook, src, dest, afterHook }) => {
  if (preHook) preHook();
  const templatePath = path.resolve(src || __dirname, "hooks");
  const gitPath = getClosestGitPath(dest);
  if (gitPath == null) {
    console.log(red("没有找到 Git 目录!!! \n -> 请先执行 git init"));
    return;
  }
  if (needInstall(templatePath, gitPath)) {
    writeHookFiles(templatePath, gitPath);
  }
  if (afterHook) afterHook();
};

const addHook = ({ preHook, src, dest, afterHook, cwd }) => {
  if (preHook) preHook();

  // remove old hooks
  const gitPath = getClosestGitPath(dest);

  if (gitPath == null) {
    console.log(red("没有找到 Git 目录!!! \n -> 请先执行 git init"));
  } else {
    const hooksPath = path.resolve(gitPath, HOOKS_DIRNAME);
    if (fs.pathExistsSync(hooksPath)) {
      console.log("正在移除旧的 Hook 目录");
      fs.moveSync(hooksPath, hooksPath + new Date());
    }
  }

  // update package.json
  const pkgPath = path.join(cwd, "package.json");
  if (fs.pathExistsSync(pkgPath)) {
    const pkgContent = JSON.parse(fs.readFileSync(pkgPath));
    if (!pkgContent.scripts) {
      pkgContent.scripts = {};
    }

    // use lint-staged to lint staged files
    pkgContent.scripts.precommit = "lint-staged";
    pkgContent["lint-staged"] = {
      "*.{js,jsx,vue}": ["eslint --fix -c .eslintrc.js", "git add"],
      "*.ts": [
        "tslint --fix -c tslint.json --force",
        "prettier --write",
        "git add"
      ],
      "*.vue": ["stylelint --fix", "git add"],
      "*.json": ["prettier --write", "git add"],
      "*.css": ["stylelint --fix", "git add"],
      "*.less": ["stylelint --fix --syntax=less", "git add"],
      "*.scss": ["stylelint --fix --syntax=scss", "git add"]
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkgContent, null, 2));
  }
  if (afterHook) afterHook();
};

module.exports = {
  addHook,
  oldAddHook
};
