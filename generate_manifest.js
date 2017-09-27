const path = require('path');
const fs = require('fs');
const assert = require('assert');
const locale2 = require('locale2/src/index').locale2;
const codes = require('cjs-iso-639');
const iso3166 = require('iso-3166-2');
const expect = require('chai').expect;

const folders = fs.readdirSync('./packages');

const getDescription = (code) => {
  //latn is not region code, sr-latn itself is lang code
  if (code === `sr-latn`) {
    return {
      langCode: code,
      language: code
    }
  }
  const [langCode, regionCode] = locale2(code).split('-');
  const x = codes['1'][langCode];
  const languageName = x[0];

  return {
    langCode,
    regionCode,
    language: languageName,
    region: regionCode ? iso3166.country(regionCode).name : null
  }
}

const manifest = folders.map((x) => {
  const description = getDescription(x);
  const pkg = require(path.resolve(path.join('./packages', x, 'package.json')));
  assert(pkg.name === `hunspell-dict-${x}`)
  assert(pkg.author === 'OJ Kwon <kwon.ohjoong@gmail.com>');
  expect(pkg.license).not.to.be.null;

  const desc = x === 'sr-latn' ? 'Serbian (Latin)' : `${description.language}${description.region ? ` (${description.region})` : ''}`
  expect(pkg.description).to.equal(`Hunspell dictionaries for ${desc}`);

  const readme = fs.readFileSync(path.resolve(path.join('./packages', x, 'readme.md')), 'utf-8');
  expect(readme).to.include(`# hunspell-dict-${x}`);

  return {
    package: `${pkg.name}@${pkg.version}`,
    ...description
  }
});

console.log(manifest);