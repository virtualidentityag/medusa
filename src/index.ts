#!/usr/bin/env node
import * as commander from 'commander';
import * as puppeteer from 'puppeteer';
import * as tryRequire from 'try-require';
import AgentService from '@percy/agent/dist/services/agent-service';
import { percySnapshot } from '@percy/puppeteer';
import * as StaticServer from 'static-server';
import getAllHtmlPagesInFolder from './getAllPagesInFolder';
import asyncForEach from './asyncForeach';
import sleep from './sleep';
const pjson = require('../package.json');
const defaultConfig = require('../config.default.js');

const path = require('path');

commander
  .option('-c, --config [file]', 'Specify config file')
  .version(pjson.version, '-v, --version')
  .parse(process.argv);


let cfgFile
if (commander.config) {
  cfgFile = tryRequire(path.join(process.cwd(), commander.config));
} else {
  cfgFile = tryRequire(path.join(process.cwd(), 'medusa.json'));
}

const config = {
  ...defaultConfig,
  ...cfgFile
}

const targetFolder = path.join(process.cwd(), config.targetDir);
const server = new StaticServer({
  rootPath: targetFolder,
  port: 36000
});

const vrtest = async () => {
  let browser = null;
  let page = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    });
    page = await browser.newPage()
  } catch (error) {
    console.log(error);
    return;
  }


  await asyncForEach(getAllHtmlPagesInFolder(targetFolder, config.ignoreFiles), async file => {
    console.log(`Snapping ${file}`);
    try {
      await page.goto(`http://localhost:36000/${file}`, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.addStyleTag({ content: '.hide-in-medusa {visibility: hidden !important;opacity: 0 !important;}' });
      await sleep(2000);
      await percySnapshot(page, file, { widths: config.screenWidths, enableJavaScript: true });
    } catch (error) {
      console.log(error);
      return;
    }
    console.log(`Done snapping ${file}`);
  });
  try {
    await browser.close();
  } catch (error) {
    console.log(error);
    return;
  }

}

const percyAgent = new AgentService();
server.start(async () => {
  console.log('Server listening to', server.port);
  try {
    await percyAgent.start({ port: 5338 });
    await vrtest();
    await percyAgent.stop();
  } catch (error) {
    console.log(error)
  }
  server.stop();
  process.exit();
});
