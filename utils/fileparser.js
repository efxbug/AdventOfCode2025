import fs from "node:fs";
import path from "node:path";

export const readFileSync = (fileName, options) => {
  return fs.readFileSync(fileName, options);
};

export const readTextLines = (fileName, options) => {
  return readFileSync(fileName, options)
    .toString()
    .split(/\r{0,1}\n{1}/g);
};

export const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};

export const isDir = (fileName) => {
  return fs.lstatSync(fileName).isDirectory();
};

export const listDir = (
  folderPath,
  showFiles = false,
  showDirs = false,
  showHidden = false,
  nameFilter
) => {
  return fs
    .readdirSync(folderPath)
    .map((fileName) => {
      return path.join(folderPath, fileName);
    })
    .filter((fileName) => {
      return (
        (!fileName.startsWith(".") || showHidden) &&
        ((isFile(fileName) && showFiles) || (isDir(fileName) && showDirs))
      );
    });
};
