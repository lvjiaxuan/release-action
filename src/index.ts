// import { getInput, debug, setOutput, setFailed } from '@actions/core'
import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
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
      'Print inputs: ' +
        JSON.stringify(
          {
            owner,
            repo,
            tag_name: tagName,
            name,
            body,
            draft,
            prerelease,
            discussion_category_name: discussionCategoryName,
            generate_release_notes: generateReleaseNotes,
          },
          null,
          2,
        ),
    )

    // https://github.com/actions/toolkit/tree/main/packages/github
    // https://docs.github.com/en/rest
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN as string)

    const id = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag: tagName })
      .then(({ data: { id } }) => id).catch(() => false)

    if (typeof id === 'number') {
      core.info(`${ tagName }'s release exists. Skip.`)
    } else {

      const params: Parameters<typeof octokit.rest.repos.createRelease>[0] = {
        owner,
        repo,
        tag_name: tagName,
        draft,
        prerelease,
        generate_release_notes: generateReleaseNotes,
      }

      name && (params.name = name)
      body && (params.body = body)
      discussionCategoryName && (params.discussion_category_name = discussionCategoryName)

      void octokit.rest.repos
        .createRelease(params)
        // eslint-disable-next-line promise/always-return
        .then(({ data }) => {
          core.info('Successfully created a release.')
          core.info('Visit: ' + data.html_url)
        })
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

void run()
