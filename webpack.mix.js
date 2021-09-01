let mix = require('laravel-mix');

mix.ts('index.ts', '/')
    .setPublicPath('dist');
// mix.typeScript()
