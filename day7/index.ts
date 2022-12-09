import { getInput } from '../utils.js';

const cdRegex = /\$ cd (?<dirname>[\w|\/|\.]*)/;
const lsRegex = /\$ ls/;
const dirRegex = /dir (?<dirname>\w+)/;
const fileRegex = /(?<size>\d+) (?<filename>\w+)\.?(?<ext>\w*)/;

class FileSystemNode {
  name: string; // Name of file or directory
  size: number; // Size of file or directory

  constructor(name: string, size: number = 0) {
    this.name = name;
    this.size = size;
  }
}

class File extends FileSystemNode {
  ext: string; // File extension

  constructor(size: number, filename: string, ext: string) {
    const name = ext ? `${filename}.${ext}` : filename;
    super(name, size);
    this.ext = ext;
  }
}

class Directory extends FileSystemNode {
  children: FileSystemNode[];
  constructor(...args) {
    super(...(args as [string, number]));
    this.children = [];
  }

  add(item: FileSystemNode) {
    this.children.push(item);
  }
}

class FileSystem {
  root: Directory;
  stack: Directory[];
  commands: string[];
  totalDiskSpace: number;

  constructor(commands: string[]) {
    this.totalDiskSpace = 70000000;
    this.commands = commands;
    this.root = new Directory('.');
    this.stack = [this.root];
    this.initialize();
    this.calculateDirSizes();
  }

  initialize() {
    this.commands.forEach(line => {
      if (line.startsWith('$ cd')) {
        const { dirname } = line.match(cdRegex).groups;
        if (dirname !== '/') {
          this.changeDirectory(dirname);
        }
      } else if (line.startsWith('$ ls')) {
        // Nothing
      } else if (line.startsWith('dir')) {
        const { dirname } = line.match(dirRegex).groups;
        this.addToCurrentDir(new Directory(dirname));
      } else {
        const { size, filename, ext } = line.match(fileRegex).groups;
        const file = new File(parseFloat(size), filename, ext);
        this.addToCurrentDir(file);
      }
    });
  }

  addToCurrentDir(item: FileSystemNode) {
    if (item instanceof File) {
      this.currentDir.size += item.size;
    }
    this.currentDir.children.push(item);
  }

  changeDirectory(name: string) {
    if (name === '..') {
      this.stack.pop();
    } else {
      const dir = this.currentDir.children.find(
        c => c instanceof Directory && c.name === name
      );
      this.stack.push(dir as Directory);
    }
    // console.log(this.cwd);
  }

  calculateDirSizes() {
    function setSize(dir: Directory) {
      if (!dir.children.length || dir.children.every(c => c instanceof File)) {
        return dir.size;
      }

      dir.children.forEach(c => {
        if (c instanceof Directory) {
          dir.size += setSize(c);
        }
      });

      return dir.size;
    }
    setSize(this.root);
  }

  findDirsUnderSize(limit: number) {
    const dirs = [];
    function findUnderSize(dir: Directory) {
      if (dir.size <= limit) {
        dirs.push(dir);
      }
      dir.children
        .filter(c => c instanceof Directory)
        .forEach(d => {
          findUnderSize(d as Directory);
        });
    }
    findUnderSize(this.root);
    return dirs;
  }

  findDirToDelete(spaceNeeded: number) {
    const total = this.totalDiskSpace;
    const used = this.root.size;
    const avail = total - used;
    const threshold = spaceNeeded - avail;

    let dirToDel: Directory;
    function findDir(dir: Directory) {
      if (dir.size >= threshold && (!dirToDel || dir.size < dirToDel.size)) {
        dirToDel = dir;
      }
      dir.children
        .filter(c => c instanceof Directory)
        .forEach(d => {
          findDir(d as Directory);
        });
    }
    findDir(this.root);

    return dirToDel;
  }

  get currentDir() {
    return this.stack[this.stack.length - 1];
  }

  get cwd() {
    return this.stack.map(dir => dir.name).join('/');
  }
}

const exampleHistory = getInput({
  transformer: (str: string) => str.split('\n'),
  example: true,
});

const history = getInput({
  transformer: (str: string) => str.split('\n'),
  example: false,
});

const FS = new FileSystem(history);
const dirs = FS.findDirsUnderSize(100000);
const dirsUnderLimitSum = dirs.reduce((acc, dir) => (acc += dir.size), 0);
console.log(dirsUnderLimitSum);
const dirToDel = FS.findDirToDelete(30000000);
console.log(dirToDel.size);
