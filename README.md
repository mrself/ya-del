[![Travis](https://img.shields.io/travis/mrself/ya-del/rust.svg?style=flat-square)](https://travis-ci.org/mrself/ya-del)
[![Npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/ya-del)

#jQuery mixin for elements

It is helpful when you develop not large project (plugin or module).

##Usage
###Installing
npm: 
```
npm i -S ya-del
```
###In code
```
var del = require('del');
$.extend(SomeModule.prototype, del);
var someModuel = new SomeModule();
someModule.initDel();
// now you can use Del api
```
