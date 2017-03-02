'use babel';

import { CompositeDisposable } from 'atom';
shell = require('shell')

export default {

  openInStash() {
    let editor
    editor = atom.workspace.getActiveTextEditor()
    if (!editor) { return }

    range = editor.getSelectedBufferRange()
    start = range.start.row + 1
    end = range.end.row
    selection = '' + start
    if (end > start) {
      selection = selection + '-' + end
    }

    repo = atom.project.getRepositories()[0]
    if (!repo) {
      return;
    }
    path = editor.getBuffer().file.path
    path = repo.relativize(path)
    repoName = repo.getOriginURL().match(/(\w+)\.git/)[1]
    commit = repo.getReferenceTarget(repo.branch)

    // https://stash.corp.squareup.com/projects/SQ/repos/solidshop/browse/file#1-2
    baseUrl = 'https://stash.corp.squareup.com/projects/SQ/repos/'
    url = baseUrl + repoName + '/browse/' + path + '?at=' + commit + '#' + selection
    shell.openExternal(url)
  }

};
