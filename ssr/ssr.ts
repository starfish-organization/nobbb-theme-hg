import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as glob from 'glob';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import 'zone.js/dist/zone-node';
import 'reflect-metadata';

export default function render(rootInputPath: string) {
  const inputPath = path.resolve(rootInputPath);

  if (!fs.statSync(inputPath).isDirectory()) {
    throw new Error('input path is not a directory');
  }
  if (!fs.statSync(path.join(inputPath, 'config.yaml')).isFile()) {
    throw new Error('config.yaml file not found');
  }

  const starfishConfigure = yaml.safeLoad(
    fs.readFileSync(path.join(inputPath, 'config.yaml'), 'utf-8')
  );
  const themePath = path.join(
    inputPath,
    starfishConfigure.STYLE.THEMEDIR,
    starfishConfigure.STYLE.THEME
  );

  const ngFactoryFilePath = path.join(themePath, './dist-server/main');

  const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(ngFactoryFilePath);

  // TODO: input the blog-dist name
  const buildedPath = path.join('.', 'blog-dist');

  const ignoreRegExp = new RegExp(
    starfishConfigure.SSR.IGNORE.map(regex => new RegExp(regex).source).join('|')
  );

  glob(path.join(buildedPath, '**/index.html'), function(err, files) {
    files
      .filter(file => {
        return !ignoreRegExp.test(file.replace(/^build/, ''));
      })
      .forEach(file => {
        try {
          const url = file.split(buildedPath)[1];
          renderModuleFactory(AppServerModuleNgFactory, {
            document: fs.readFileSync(file, 'utf-8'),
            url: url,
            extraProviders: [
              provideModuleMap(LAZY_MODULE_MAP)
            ]
          }).then(html => {
            fs.writeFileSync(path.join(buildedPath, url), html, 'utf-8');
          });
        } catch (error) {
          console.error(error);
        }
      });
  });
}
