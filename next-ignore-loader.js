// A custom webpack loader that ignores specific imports in node_modules
module.exports = function(source) {
  const options = this.getOptions() || {};
  const ignore = options.ignore || [];
  
  // Replace imports for specified modules with empty imports
  let modifiedSource = source;
  
  ignore.forEach((moduleName) => {
    // Handle different import patterns
    const patterns = [
      // ES6 imports
      new RegExp(`import\\s+[^;]*?['"]${moduleName}['"][^;]*?;`, 'g'),
      // CommonJS requires
      new RegExp(`(?:const|let|var)\\s+[^=]*?=\\s*require\\(['"]${moduleName}['"]\\)[^;]*?;`, 'g'),
      new RegExp(`require\\(['"]${moduleName}['"]\\)`, 'g')
    ];
    
    patterns.forEach(pattern => {
      modifiedSource = modifiedSource.replace(pattern, '/* ignored import */');
    });
  });
  
  return modifiedSource;
};
