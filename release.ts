// Locally: Test(optional) && Bump && Build(optional) && Changelog(optional) && Commit && Tag && Push
// Remotely(Trigger GitHub Action): GitHub Release & Publish(including pre-test and pre-build)

import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import semver from 'semver'
import { execa } from 'execa'
import { prompt } from 'enquirer'
import { version as currentVersion } from './package.json'

const args = process.argv.slice(2)

async function runTest() {
  console.log(chalk.cyan('\nRunning test...'))
  await execa('nr', [ 'test' ], { stdio: 'inherit' })
}

async function bumpVersion() {
  console.log(chalk.cyan('\nBumping monorepo versions...'))
  let targetVersion = args[0]

  if (!targetVersion) {
    const { release } = await prompt<{ release: string }>({
      type: 'select',
      name: 'release',
      message: `Select release version type(current ${ currentVersion })`,
      choices: [ ...[ 'patch', 'minor', 'major' ].map(type => semver.inc(currentVersion, type as semver.ReleaseType)!), 'custom' ],
    })
    if (release === 'custom') {
      targetVersion = (await prompt<{ version: string }>({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })).version
    } else {
      targetVersion = release
    }
  }

  updateVersions(targetVersion)

  return targetVersion
}

async function runGit(version: string) {
  console.log(chalk.cyan('\nGit committing and pushing...'))
  await execa('git', [ 'add', '-A' ])
  await execa('git', [ 'commit', '-m', `Release: v${ version }` ])
  await execa('git', [ 'push' ])
  console.log(chalk.cyan('\nGit tagging and pushing...'))
  await execa('git', [ 'tag', `v${ version }` ])
  await execa('git', [ 'push', 'origin', `refs/tags/v${ version }` ])
}


async function main() {
  // await runTest()
  const version = await bumpVersion()
  await runGit(version)
}

main().catch(err => {
  updateVersions(currentVersion)
  console.error(err)
})


// utils =================================================================


function updatePackage(pkgRoot: string, version: string) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { version: string }
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function updateVersions(version: string) {
  // 1. update root package.json
  updatePackage(__dirname, version)
  // 2. update all packages
  const getPkgRoot = (pkg: string) => path.resolve(__dirname, 'packages/' + pkg)
  const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))
  packages.forEach(p => updatePackage(getPkgRoot(p), version))
}
