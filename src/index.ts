import * as core from '@actions/core';
import fs from 'fs';
import util from 'util';
const readFileAsync = util.promisify(fs.readFile);

function getNestedObject(nestedObj: any, pathArr: string[]) {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
    nestedObj
  );
}

async function run() {
  const path: string = core.getInput('path');
  const jsonString: string = core.getInput('json');
  const prop: string[] = core.getInput('prop_path').split('.');
  try {
    var json: string;
    if(path){
      const buffer = await readFileAsync(path); 
      json = JSON.parse(buffer.toString());
    } else {
      json = JSON.parse(jsonString);
    }
    const nestedProp = getNestedObject(json, prop);
    if (nestedProp) {
      core.setOutput('prop', nestedProp);
    } else {
      core.setFailed('no value found :(');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
