const { exec } = require('shelljs');
const path = require('path');
const pkgOpts = require(path.join(process.cwd(), 'package.json'));

const pathCwd = process.cwd();
const pathNodeModules = path.join(pathCwd, 'node_modules');
const run = cmd => exec(cmd, { silent: true });

function modulePath(dep) {
  return path.join(pathNodeModules, dep);
}

function moduleIndexPath(dep) {
  return path.join(modulePath(dep), 'index.js');
}

function backupPath(dep) {
  return path.join(pathNodeModules, dep) + '__BACKUP';
}

function backupModule(dep) {
  return run(`cp -rf ${modulePath(dep)} ${backupPath(dep)}`);
}

function restoreModule(dep) {
  return run(`cp -rf ${backupPath(dep)} ${modulePath(dep)}`);
}

function removeBackup(dep) {
  return run(`rm -rf ${backupPath(dep)}`);
}

function removeModule(dep) {
  return run(`rm -rf ${modulePath(dep)}`);
}

function formatDepKey(key) {
  return key ? `${key}Dependencies` : 'dependencies';
}

function link(dep) {
  // Backup before we do anything so we can quickly restore.
  backupModule(dep);

  // We must try to link to get the actual linked path.
  const pathToLink = parseLinkPath(run(`npm link ${dep}`).stdout);

  // Remove after trying to link because we either create an index.js instead
  // of a symlink, or we restore the backed up module.
  removeModule(dep);

  // If we got a path, then it means we have a local link. If not, then we undo
  // the linking process as it will try to link something.
  if (pathToLink) {
    createModuleLink(dep, pathToLink);
  } else {
    restoreModule(dep);
  }

  // Cleanup after processing.
  removeBackup(dep);
}

function linkEach(type) {
  Object.keys(type || {}).forEach(key => link(key, type[key]));
}

function parseLinkPath(stdout) {
  // The returned paths will have a third part if a npm link has been called
  // on a local working copy.
  return (stdout.split('->')[2] || '').trim();
}

function createModuleLink(dep, pathToLink) {
  run(`mkdir -p ${modulePath(dep)}`);
  run(`echo "module.exports = require('${pathToLink}');" > ${moduleIndexPath(dep)}`);
  console.log(`linked ${dep}`);
}

['', 'dev', 'optional', 'peer']
  .map(formatDepKey)
  .map(key => pkgOpts[key])
  .forEach(linkEach);
