
export function extractDeepPropFromObject(object: any, propName: string): any {
  const depth = propName.split('.');
  let lastObjIn = object;
  let returnVal = null;
  for (let deep = 0; deep < depth.length; deep++) {
    returnVal = lastObjIn[`${depth[deep]}`];
    // if the value will be an array return as normal Array form only this prop value
    if(returnVal && Array.isArray(returnVal) && deep == depth.length - 2)
      return returnVal.map((val)=>{ return val[`${depth[deep+1]}`] ; } );
    lastObjIn = returnVal;
  }
  return returnVal;
}
