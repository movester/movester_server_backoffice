const githubLabelSync = require('github-label-sync');

githubLabelSync({
  accessToken: process.env.GITHUB_ACCESS_TOKEN,
  repo: 'movester/movester_server_backoffice',
  labels: [],
  dryRun: true,
}).then(diff => {
  console.log(diff);
});