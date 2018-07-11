/**
 * @file
 * @desc lint project
 * @author liuyuanyangscript@gmail.com https://github.com/hoperyy
 * @date  2017/08/11
 */

const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
const { red, green } = require('chalk')

const util = require('../util')

const fse = require('fs-extra')

const cwd = process.cwd()

async function initConfigFiles ({ type }) {
  if (!type) {
    type = 'node'
  }
  function cpTpt (templatePath) {
    return util.copyTpt(path.join(__dirname, templatePath), cwd)
  }
  switch (type) {
    case 'es6':
      return cpTpt('template-es6')
      break
    case 'ts':
      return cpTpt('template-ts')
      break
    case 'node':
      return cpTpt('template-node')
      break
    default:
      console.log(red('未知类型'))
  }
}

function installDependencies ({ type }) {
  if (!type) {
    type = 'node'
  }
  const commonModule = [
    'babel-eslint',
    'lint-staged',
    'eslint',
    'eslint-plugin-react',
    'eslint-plugin-vue',
    'eslint-config-vue',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'eslint-config-prettier',
    'prettier'
  ]

  const nodeModule = [
    ...commonModule,
    'eslint-plugin-node',
    'tslint',
    'tslint-plugin-prettier',
    'tslint-config-prettier'
  ]
  const es6Module = [...commonModule]
  const tsModule = ['prettier', 'tslint', 'tslint-plugin-prettier']

  let modules
  switch (type) {
    case 'node':
      modules = nodeModule
      break
    case 'ts':
      modules = tsModule
      break
    default:
      modules = es6Module
  }
  modules.push('husky')
  util.ensureModule(modules, cwd)
}

function execLint ({ finalLintTarget, lintResultSrcFile, fix }) {
  if (!fs.existsSync(path.join(cwd, 'node_modules/eslint/lib/cli.js'))) {
    console.log(
      red(`\n错误：当前目录没有安装 eslint，请先执行 ${green('v lint init')} 命令完成初始化\n`)
    )
    return 999 // exitCode
  }

  const eslintCliPath = path.join(cwd, 'node_modules/eslint/lib/cli.js')
  const eslintCli = require(eslintCliPath)
  const eslintOrder = [
    '',
    '',
    finalLintTarget,
    '-c',
    '.eslintrc.js',
    '--format',
    'html',
    '--ext',
    'vue,js',
    '--output-file',
    lintResultSrcFile
  ]

  // 准备结果文件
  fse.ensureFileSync(lintResultSrcFile)

  const exitCode = eslintCli.execute(
    fix ? eslintOrder.concat(['--fix']) : eslintOrder
  )
  return exitCode
}

let globalParams

/**
 * @func
 * @desc lint
 */
module.exports = {
  initParams (params) {
    globalParams = {
      ...params,
      lintResultSrcFile: path.resolve(
        cwd,
        'lint-result',
        'eslint-result-src.html'
      )
    }
  },

  initConfigFiles,

  installDependencies,

  exec () {
    const { finalLintTarget, lintResultSrcFile, fix } = globalParams
    return execLint({ finalLintTarget, lintResultSrcFile, fix })
  }
}
