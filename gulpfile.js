// Gulp sirve para automatizar tareas


const { src, dest, watch, parallel } = require('gulp'); // Importa los métodos src, dest, watch y parallel del módulo "gulp" ubicado en node_modules --> gulp
// src indica la ruta de los archivos de origen y dest la ruta de destino donde se colocarán los archivos procesados


// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber'); // Más abajo explico para qué sirve
const autoprefixer = require('autoprefixer'); // Este,
const cssnano = require('cssnano'); // este
const postcss = require('gulp-postcss'); // y este mejoran mucho el código css. Lo hacen más ligero
const sourcemaps = require('gulp-sourcemaps'); // Sourcemaps se utiliza para que el código sea legible dentro del navegador

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css( done ) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) // Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') ) // Almacenarla en el disco duro
    done(); // Callback que avisa a gulp cuando llegamos al final
}
/* La función pipe() en Gulp se utiliza para encadenar operaciones en un flujo (stream) de archivos. 
Es una característica central de la arquitectura de Gulp que permite realizar múltiples transformaciones o manipulaciones 
en los archivos de forma secuencial y eficiente. */

function imagenes(done) { // Aligera las imágenes
    const opciones = {
        optimizationLevel: 3 // Mejora las imágenes
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )
    done();
}

function versionWebp( done ) { // Modifica las imaágenes a webp
    const opciones = {
        quality: 50 // Es la calidad de la imagen
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
    done();
}

function versionAvif( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    done();
}

function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() ) // Mejora la velocidad de carga
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css); // watch ayuda a conservar los cambios cuando se hace una modificación. En lugar de tener que volver 
    watch('src/js/**/*.js', javascript); // a ejecutar la tarea, se guarda automáticamente.
    done();
}

function tarea (done) { // El done es un callback
    console.log('Desde la primera tarea');
    done();
}

//Código de node.js
exports.tarea = tarea;
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev) ; // Ejecuta más de una tarea al mismo tiempo

// Si quieres correr algo a traves de npm (npm run sass) tiene que estar escrito en la parte de scripts dentro de package.json. Si no, lo 
// puedes correr con npx (npx gulp dev)
/* Plumber se utiliza para evitar que el flujo de ejecución se detenga por completo debido a errores en las tareas de Gulp. 
Cuando se ejecutan múltiples tareas en Gulp, es posible que un error en una de las tareas cause que Gulp se detenga por completo y no se 
ejecuten las tareas restantes. Esto puede resultar frustrante y dificultar la depuración de problemas en el flujo de trabajo.
El complemento "plumber" se utiliza para solucionar este problema. Al agregar "plumber" a una tarea de Gulp, cualquier error que 
ocurra durante la ejecución de esa tarea no detendrá el flujo de ejecución general de Gulp. En lugar de eso, "plumber" capturará 
el error, lo registrará en la consola y permitirá que las demás tareas continúen ejecutándose normalmente. */