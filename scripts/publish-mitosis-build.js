#!/usr/bin/env zx

const repo = 'git@github.com:BuilderIO/mitosis-build.git';
const srcRepoRef = 'https://github.com/BuilderIO/mitosis/commit/';
const root = __dirname + '/..';
const packages_core = root + '/packages/core';
const mitosis_build = packages_core + '/mitosis-build';

(async () => {
  await $`rm -rf ${mitosis_build}`;
  const SHA = String(await $`git rev-parse HEAD`).trim();
  cd(`${root}/packages/core`);
  await $`git clone ${repo}`;
  const branch = await $`git branch --show-current`;
  const msg = String(await $`git log --oneline -1 --no-decorate`).trim();
  cd(`${mitosis_build}`);
  await $`git checkout ${branch} || git checkout -b ${branch}`;
  cd(`${packages_core}`);
  await $`cp -r CHANGELOG.md package.json README.md dist ${mitosis_build}`;
  cd(`${mitosis_build}`);
  await $`git add --all`;
  await $`git commit --allow-empty -m ${msg + '\n\n' + srcRepoRef + SHA}`;
  await $`git push ${repo} HEAD:${branch}`;
  await $`rm -rf ${mitosis_build}`;
})();
