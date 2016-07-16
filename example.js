/* eslint-disable import/no-extraneous-dependencies */

import download from 'download-package-tarball';

download({
  // a npm tarball url will work
  url: 'https://registry.npmjs.org/snappy/-/snappy-5.0.5.tgz',
  dir: '/dir/where/file/will/be/downloaded'
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});

download({
  // ... but also a github tarball url
  url: 'https://api.github.com/repos/kesla/node-snappy/tarball/master',
  dir: '/dir/where/file/will/be/downloaded',
  // custom options that will be forwarded to got.stream(..., opts) can also be set
  gotOpts: {
    headers: {
      beep: 'boop'
    }
  }
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});

download({
  // or a tar file somewhere
  url: 'http://link-to-tarball/file.tar',
  dir: '/dir/where/file/will/be/downloaded'
}).then(() => {
  console.log('file is now downloaded!');
}).catch(err => {
  console.log('oh crap the file could not be downloaded properly');
  console.log(err);
});
