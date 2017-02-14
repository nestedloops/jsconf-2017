/**
 * Copied over from https://github.com/sindresorhus/junk/blob/master/index.js
 * because the uglifyjs we're does not understand arrow functions.
 * Their licence applies:
 *
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// # All
// /^npm-debug\.log$/,           // npm error log
// /^\..*\.swp$/,                // vim state
// // macOS
// /^\.DS_Store$/,               // stores custom folder attributes
// /^\.AppleDouble$/,            // stores additional file resources
// /^\.LSOverride$/,             // contains the absolute path to the app to be used
// /^Icon\r$/,                   // custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
// /^\._.*/,                     // thumbnail
// /^\.Spotlight-V100(?:$|\/)/,  // directory that might appear on external disk
// /\.Trashes/,                  // file that might appear on external disk
// /^__MACOSX$/,                 // resource fork
// # Linux
// /~$/,                         // backup file
// # Windows
// /^Thumbs\.db$/,               // image file cache
// /^ehthumbs\.db$/,             // folder config file
// /^Desktop\.ini$/              // stores custom folder attributes

exports.re = /^npm-debug\.log$|^\..*\.swp$|^\.DS_Store$|^\.AppleDouble$|^\.LSOverride$|^Icon\r$|^\._.*|^\.Spotlight-V100(?:$|\/)|\.Trashes|^__MACOSX$|~$|^Thumbs\.db$|^ehthumbs\.db$|^Desktop\.ini$/;

exports.is = filename => exports.re.test(filename);

exports.not = filename => !exports.is(filename);
