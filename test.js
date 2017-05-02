import {join} from 'path';

import {pack} from 'tar-stream';
import tmp from 'then-tmp';
import test from 'tapava';
import fs from 'fs-extra';
import httpTestServer from 'http-test-server';

import download from './lib';

test('downloadPackageTarball()', async t => {
  const {baseUrl: url, shutdown} = await httpTestServer((req, res) => {
    t.match(req.headers, {custom: 'beep-boop'});

    const packStream = pack();
    packStream.entry({name: 'dir/package.json'}, JSON.stringify({
      name: '@scope/package-name'
    }));
    packStream.entry({name: 'dir/test.txt'}, 'this is a test file');
    packStream.finalize();
    packStream.pipe(res);
  });

  const {path: tmpDir} = await tmp.dir();

  await download({
    url,
    gotOpts: {
      headers: {
        custom: 'beep-boop'
      }
    },
    dir: tmpDir
  });

  const actualContent = await fs.readFile(join(tmpDir, '@scope/package-name/test.txt'), 'utf8');
  const expectedContent = 'this is a test file';

  t.is(actualContent, expectedContent);

  await shutdown();
});
