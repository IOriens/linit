const { resolve } = require('url')

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const { red, green } = require('chalk')

function ensureModule (packageNames, cwd) {
  if (!fs.existsSync(path.join(cwd, 'package.json'))) {
    console.log(
      red(
        `\n没有在当前目录检测到 package.json，如果项目依赖已含以下依赖，可忽略，否则请自行安装：\n\n-- ${packageNames.join('\n-- ')}\n`
      )
    )
    return
  }

  const uninstalled = []
  packageNames.forEach(packageName => {
    try {
      require(path.join(cwd, 'node_modules', packageName))
    } catch (err) {
      uninstalled.push(`${packageName}@latest`)
    }
  })

  if (uninstalled.length) {
    console.log('\ninstalling dependencies.\n')
    require(
      'child_process'
    ).execSync(`cd ${cwd} && npm install ${uninstalled.join(' ')} --save-dev`, {
      stdio: 'inherit'
    })
    console.log('\ninstallation done.\n')
  }
}

function confirm (fileName) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'cover',
          message: `是否覆盖之前存在的文件：${fileName}`
        }
      ])
      .then(answers => {
        resolve(answers.cover)
      })
  })
}

async function copyTpt (tptDir, targetDir) {
  const tptFiles = fs.readdirSync(tptDir)
  console.log('tptDir', tptDir)
  let fileName

  for (let i = 0, len = tptFiles.length; i < len; i++) {
    fileName = tptFiles[i]
    const targetFile = path.join(targetDir, fileName)
    if (fs.existsSync(targetFile)) {
      const shouldCover = await confirm(fileName)
      if (shouldCover) {
        fse.copySync(path.join(tptDir, fileName), targetFile)
        console.log(green(`${fileName} covered.`))
      }
    } else {
      fse.copySync(path.join(tptDir, fileName), targetFile)
      console.log(green(`${fileName} created.`))
    }
  }
}

module.exports = {
  ensureModule,
  copyTpt
}
