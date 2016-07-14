import downloadTarball from 'download-tarball';
import {wrap as co} from 'co';
import {join as joinPath} from 'path';
import rimraf from 'rimraf-then';
import mkdirp from 'mkdirp-then';
import {rename, readdir} from 'then-fs';
import tmp from 'tmp';
import npa from 'npm-package-arg';
import Promise from 'bluebird';
import readJSON from 'then-read-json';

const tmpDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, path, cleanupCallback) => {
    if (err) {
      reject(err);
    } else {
      resolve({path, cleanupCallback});
    }
  });
});

const makeParentDir = (dir, scope) => {
  return scope ? mkdirp(joinPath(dir, scope)) : mkdirp(dir);
};

module.exports = co(function * ({url, gotOpts, dir}) {
  const {path: tmpPath, cleanupCallback} = yield tmpDir();
  yield downloadTarball({ url, gotOpts, dir: tmpPath });
  const [fromDirname] = yield readdir(tmpPath);
  const src = joinPath(tmpPath, fromDirname);
  const {name} = yield readJSON(joinPath(src, 'package.json'));
  const {scope} = npa(name);
  const dest = joinPath(dir, name);

  yield makeParentDir(dir, scope);
  yield rimraf(dest);
  yield rename(src, dest);

  cleanupCallback();
});
