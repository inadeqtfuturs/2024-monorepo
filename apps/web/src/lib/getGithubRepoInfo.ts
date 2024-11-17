type Repo = {
  name: string;
  url: string;
};

async function getGithubRepoInfo(
  user: string,
  selectRepositories: string[] = [],
) {
  if (!user) return null;

  const repositories = await fetch(
    `https://api.github.com/users/${user}/repos`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
    .then((resp) => {
      console.log('@--> resp', resp);
      return resp.json();
    })
    .then((resp) => {
      if (resp.message) throw Error;
      if (selectRepositories.length === 0) {
        return resp;
      }
      return resp.filter((r: Repo) => selectRepositories.includes(r.name));
    })
    .catch((error) => {
      console.log('@--> error', error);
      throw new Error(error);
    });

  if (!repositories || repositories.length === 0) return null;

  const repositoryInfo = await Promise.all(
    repositories.map(async (r: Repo) => {
      const url = r?.url;
      const { names } = await fetch(`${url}/topics`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
          Authorization: `Bearer ${process.env.GH_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }).then((resp) => resp.json());

      return {
        ...r,
        topics: names,
      };
    }),
  );

  return repositoryInfo;
}

export default getGithubRepoInfo;
