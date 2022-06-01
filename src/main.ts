// import { getInput, debug, setOutput, setFailed } from '@actions/core'
import core from '@actions/core'
import github from '@actions/github'

async function run(): Promise<void> {
  try {
    // const ms: string = getInput('milliseconds')
    // debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // debug(new Date().toTimeString())

    // setOutput('time', new Date().toTimeString())

    // https://github.com/actions/toolkit/tree/main/packages/github
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN as string)
    const { owner, repo } = github.context.repo

    // Get inputs
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    const tagName = core.getInput('tag_name', { required: false }) || github.context.ref.replace('refs/tags/', '')
    const name = core.getInput('name', { required: false })
    const body = core.getInput('body', { required: false })
    const draft = core.getInput('draft', { required: false })
    const prerelease = core.getInput('prerelease', { required: false })
    const discussionCategoryName = core.getInput('discussion_category_name', { required: false })
    const generateReleaseNotes = core.getInput('generate_release_notes', { required: false })

    core.info(
      'Print some variant: ' +
        JSON.stringify({
          owner,
          repo,
          tagName,
          name,
          body,
          draft,
          prerelease,
          discussionCategoryName,
          generateReleaseNotes,
        })
    )
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
