import fileInclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
    //Получаем доступ к файлам и папкам по указанному пути
    return app.gulp.src(app.path.src.html)
        //Обрабатываем ошибки,при появлении ошибок показываем сообщения
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            })
        ))
        // Собираем файл HTML из частей
        .pipe(fileInclude())
        //Заменяем алиасы (@img) в файле на нормальные пути
        .pipe(app.plugins.replace(/@img\//g, 'img/'))
        //Обрабатываем картинки отличающиеся от svg
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                webpHtmlNosvg()
            )
        )
        //Избегаем неприятных ситуаций с кешированием
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                versionNumber({
                    'value': '%DT%',
                    'append': {
                        'key': '_v',
                        'cover': 0,
                        'to': [
                            'css',
                            'js'
                        ]
                    },
                    'output': {
                        'file': 'gulp/version.json'
                    }
                })
            )
        )
        //Переносим в папку назначения
        .pipe(app.gulp.dest(app.path.build.html))
        //Выполняем обновление страницы
        .pipe(app.plugins.browsersync.stream());
} 