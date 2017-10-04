import {join as joinPath} from 'path';

import downloadTarball from 'download-tarball';
import rimraf from 'rimraf-then';
import mkdirp from 'mkdirp-then';
import {readdir, move} from 'fs-extra';
import tmp from 'then-tmp';
import npa from 'npm-package-arg';
import readJSON from 'then-read-json';

const makeParentDir = (dir, scope) => {
  return scope ? mkdirp(joinPath(dir, scope)) : mkdirp(dir);
};

module.exports = async ({url, gotOpts, dir}) => {
  const {path: tmpPath, cleanupCallback} = await tmp.dir();
  await downloadTarball({url, gotOpts, dir: tmpPath});
  const [fromDirname] = await readdir(tmpPath);
  const src = joinPath(tmpPath, fromDirname);
  const {name} = await readJSON(joinPath(src, 'package.json'));
  const {scope} = npa(name);
  const dest = joinPath(dir, name);

  await makeParentDir(dir, scope);
  await rimraf(dest);
  await move(src, dest);

  cleanupCallback();
};
