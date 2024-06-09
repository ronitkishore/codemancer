import { Octokit } from "@octokit/rest";

export async function fetchPullRequests(repositoryUrl: string) {
  const octokit = new Octokit();

  const [owner, repo] = extractOwnerAndRepo(repositoryUrl);

  const { data: pullRequests } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
  });

  return pullRequests;
}

export async function analyzePullRequest(
  repositoryUrl: string,
  pullRequestId: string
) {
  const octokit = new Octokit();
  const [owner, repo] = extractOwnerAndRepo(repositoryUrl);
  const { data: prFiles } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: parseInt(pullRequestId),
  });

  const codeAnalysis = await Promise.all(
    prFiles.map(async (file) => {
      const { data: fileContent } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.filename,
        // ref: file.sha,
        format: "string",
      });

      const response = await fetch(
        (fileContent as { download_url: string }).download_url
      );
      const code = await response.text();

      const analysisResponse = await fetch("/api/analyseCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const { analysis } = await analysisResponse.json();

      return {
        filename: file.filename,
        analysis,
      };
    })
  );

  return {
    id: pullRequestId,
    codeAnalysis,
  };
}

function extractOwnerAndRepo(url: string) {
  const parts = url.split("/");
  const owner = parts[3];
  const repo = parts[4];
  return [owner, repo];
}
