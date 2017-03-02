'use babel';

import { CompositeDisposable } from 'atom';
shell = require('shell')

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that opens stash
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sqopen:openInStash': () => this.openInStash()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

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
