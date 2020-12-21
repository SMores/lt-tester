import querystring from 'querystring';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function main() {
  const lorem = fs.readFileSync(path.join(process.cwd(), 'lorem.txt'), {
    encoding: 'utf8',
  });
  const initialGrafs = fs
    .readFileSync(path.join(process.cwd(), 'grafs.txt'), { encoding: 'utf8' })
    .split('\n');
  const grafs = initialGrafs.reduce((acc, graf) => {
    for (let index = 0; index < 100; index++) {
      const letterIndex = Math.round(Math.random() * 26 * 2 - 1);
      const letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[
        letterIndex
      ];
      const position = Math.round(Math.random() * graf.length - 1);
      acc.push(
        graf.slice(0, position) + letter + graf.slice(position, graf.length - 1)
      );
    }
    acc.push(
      Array.from({ length: 20 })
        .map(() => graf)
        .join('\n')
    );
    acc.push(lorem);
    return acc;
  }, []);
  const startTime = Date.now();
  const responses = await Promise.all(
    grafs.map((graf) =>
      fetch(
        `http://localhost:8081/v2/check?${querystring.stringify({
          language: 'en-US',
          text: graf,
        })}`,
        {
          method: 'GET',
        }
      ).then((response) => response.json())
    )
  );
  const delta = Date.now() - startTime;
  console.log(responses, delta);
}

main();
