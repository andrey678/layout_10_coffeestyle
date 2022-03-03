//Препроцессор SASS
import dartSass from "sass";
//Плагин для запуска препроцессора
import gulpSass from "gulp-sass";
//Плагин для переименования типов файлов
import rename from "gulp-rename";

import cleanCss from 'gulp-clean-css'; //Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа запросов


//Вызов плагина gulpSass с передачей компилятора dartSass
const sass = gulpSass(dartSass);

export const scss = () => {
    //Отслеживание в каком из файлов scss написан стиль(для обработки ошибок)
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        //Обработка ошибок
        .pipe(app.plugins.plumber(
            //Уведомление об ошибке
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })
        ))
        //Обработка алиасов
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        //Запускаем компилятор
        .pipe(sass({
            //Изначальный стиль готового файла
            outputStyle: 'expanded'
        }))
        //Группируем медиа запросы
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                groupCssMediaQueries()
            )
        )
        // Выводим картинки в формате webp
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                webpcss(
                    {
                        webpClass: ".webp",
                        noWebpClass: ".no-webp"
                    }
                )
            )
        )
        //Запускаем автоматическое добавление вендорных префиксов для кроссбраузерности
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                autoprefixer({

                    grid: true, // Поддержка свойств grid сеток
                    overrideBrowserslist: ["last 3 versions"], // кол-во версий браузера
                    cascade: true // 
                })
            )
        )
        //Раскомментировать если нужен не сжатый дубль файла стилей
        .pipe(app.gulp.dest(app.path.build.css))
        // делаем сжатие/минификацию файла стилей
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                cleanCss()
            )
            )
        // переименовываем файл
        .pipe(rename({
            extname: ".min.css"
        }))
        //Выгружаем в папку с результатом
        .pipe(app.gulp.dest(app.path.build.css))
        //Обновляем браузер
        .pipe(app.plugins.browsersync.stream());
}