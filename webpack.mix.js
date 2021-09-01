let mix = require('laravel-mix');

mix.ts('index.tsx', '/')
    .setPublicPath('dist');
// mix.typeScript()
