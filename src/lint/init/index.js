/**
 * @file
 * @desc lint project
 * @author liuyuanyangscript@gmail.com https://github.com/hoperyy
 * @date  2017/08/11
 */

const fs = require('fs-extra')
const path = require('path')
const sh = require('shelljs')

const { red, green } = require('chalk')


const hook = require('../../hook')

const cwd = process.cwd()

const eslint = require('../lib/eslint/index')
const stylelint = require('../lib/stylelint/index')

let globalParams

function initParams (params) {
  globalParams = {
    ...params,
    finalLintTarget: cwd,
    stylelintResultSrcFile: path.resolve(
      cwd,
      'lint-result',
      'stylelint-result-src.html'
    ),
    eslintResultSrcFile: path.resolve(
      cwd,
      'lint-result',
      'eslint-result-src.html'
    ),
    lintResultIndexFile: path.resolve(
      cwd,
      'lint-result',
      'lint-result-index.html'
    )
  }
}

function initGitignore () {
  const ignoreConfigPath = path.join(cwd, '.gitignore')
  if (fs.pathExistsSync(ignoreConfigPath)) {
    const ignoreFile = fs.readFileSync(ignoreConfigPath)
    console.log(green('\n更新.gitignore文件'))
    if (ignoreFile.toString().indexOf('lint-result') === -1) {
      fs.appendFileSync(ignoreConfigPath, '\n# eslint result\nlint-result\n')
    }
    if (ignoreFile.toString().indexOf('node_modules') === -1) {
      fs.appendFileSync(ignoreConfigPath, '\n# node_modules\nnode_modules\n')
    }
  } else {
    fs.writeFileSync(ignoreConfigPath, '# eslint result\nlint-result\n')
  }
}

/**
 * @func
 * @desc lint
 */
module.exports = async params => {

    // { lintTarget, watch, fix } = params
    initParams(params)

    const {
      stylelintResultSrcFile,
      eslintResultSrcFile,
      lintResultIndexFile
    } = globalParams

    // 初始化参数
    eslint.initParams({ ...globalParams })
    stylelint.initParams({ ...globalParams })

    // 添加 Hook
    console.log(green('\n添加 Hook\n'))
    hook.addHook({ cwd })

    // 初始化配置文件
    console.log(green('\n生成配置文件\n'))
    await eslint.initConfigFiles({})
    await stylelint.initConfigFiles({})
    initGitignore()

    // 安装相应依赖
    console.log(green('\n检查依赖是否安装\n'))
    eslint.installDependencies({})
    stylelint.installDependencies()

    console.log(green('\n依赖已安装\n'))
    console.log('\nlint 初始化完成!\n')

}
