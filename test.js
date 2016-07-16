import {pack} from 'tar-stream';
import tmp from 'tmp';
import test from 'tapava';
import download from './lib';
import fs from 'then-fs';
import {join} from 'path';
import httpTestServer from 'http-test-server';

test('downloadPackageTarball()', function * (t) {
  const {baseUrl: url, shutdown} = yield httpTestServer((req, res) => {
    t.match(req.headers, {custom: 'beep-boop'});

    const packStream = pack();
    packStream.entry({name: 'dir/package.json'}, JSON.stringify({
      name: '@scope/package-name'
    }));
    packStream.entry({name: 'dir/test.txt'}, 'this is a test file');
    packStream.finalize();
    packStream.pipe(res);
  });

  const {name: tmpDir} = tmp.dirSync();

  const d = download({
    url,
    gotOpts: {
      headers: {
        custom: 'beep-boop'
      }
    },
    dir: tmpDir
  });

  t.truthy(d.then, 'answer is promise');

  yield d;
  const actualContent = yield fs.readFile(join(tmpDir, '@scope/package-name/test.txt'), 'utf8');
  const expectedContent = 'this is a test file';
  t.is(actualContent, expectedContent);
  yield shutdown();
});
