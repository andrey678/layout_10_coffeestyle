// Подключаем модуль webpack для возможности сборки
// из разных модулей единого файла javascript
// с помощью возможностей ES6
import webpack from "webpack-stream";

export const js = () => {
    // Получаем доступ к файлу, 
    // включаем карту исходников, чтобы понимать в каком файле произошла ошибка
    return app.gulp.src(app.path.src.js, {sourcemaps: app.isDev})
    // Подключаем обработчик ошибок при компиляции
    .pipe(app.plugins.plumber(
        //Подключаем notify для показа ошибок
        app.plugins.notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>"
        }))
        )
        //Запускаем webpack в режиме разработки
        //Указываем файл результата
        .pipe(webpack({
            mode: app.isBuild ? 'production' : 'development',
            output: {
                filename: 'app.min.js',
            }
        }))
        //Выгружаем файл в папку с результатом
        .pipe(app.gulp.dest(app.path.build.js))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream());
}