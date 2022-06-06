// import { getInput, debug, setOutput, setFailed } from '@actions/core'
import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    const { owner, repo } = github.context.repo

    // Get inputs
    // https://docs.github.com/en/rest/releases/releases#create-a-release
    const tagName = core.getInput('tag_name', { required: false }) || github.context.ref.replace('refs/tags/', '')
    const name = core.getInput('name', { required: false })
    const body = core.getInput('body', { required: false })
    const draft = core.getBooleanInput('draft', { required: false })
    const prerelease = core.getBooleanInput('prerelease', { required: false })
    const discussionCategoryName = core.getInput('discussion_category_name', { required: false })
    const generateReleaseNotes = core.getBooleanInput('generate_release_notes', { required: false })

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
          // discussionCategoryName,
          generateReleaseNotes,
        })
    )

    // https://github.com/actions/toolkit/tree/main/packages/github
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN as string)
    octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      name,
      body,
      draft,
      prerelease,
      discussion_category_name: discussionCategoryName,
      generate_release_notes: generateReleaseNotes
    })

    core.info('Create a release successfully')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
