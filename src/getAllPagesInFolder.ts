const path = require('path');
const fs = require('fs');

const getAllHtmlPagesInFolder = (folder = path.join(process.cwd(), 'dist'), ignoredFiles = []) =>
  fs.readdirSync(folder)
    .filter(name => ignoredFiles.indexOf(name) === -1 && name.indexOf('.html') !== -1);

export default getAllHtmlPagesInFolder;
