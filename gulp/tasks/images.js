//Плагин для добавления формата webp к изображениям
import webp from "gulp-webp";
//Плагин для оптимизации и уменьшения изображений
import imagemin from "gulp-imagemin";

export const images = () => {
    return app.gulp.src(app.path.src.images)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "IMAGES",
                message: "Error: <%= error.message %>"
            })
        ))
        //Проверяем картинки в папке с результатом через newer
        .pipe(app.plugins.newer(app.path.build.images))
        //Создаём изображения webp
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                webp()
            )
        )
        //Выгружаем в папку с результатом
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                app.gulp.dest(app.path.build.images)
            )
        )
        //Ещё раз получаем доступ к папке с исходниками
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                app.gulp.src(app.path.src.images)
            )
        )
        // Ещё раз проверяем на обновления
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                app.plugins.newer(app.path.build.images)
            )
        )
        // Сжимаем картинки
        .pipe(
            app.plugins.if(
                //Если это режим production, то выполняем действие
                app.isBuild,
                imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    interlaced: true,
                    optimizationLevel: 3 // от 0 до 7
                })
            )
        )
        //Выгружаем полученные картинки в папку с результатом
        .pipe(app.gulp.dest(app.path.build.images))
        // Получаем доступ к SVG изображениям
        .pipe(app.gulp.src(app.path.src.svg))
        // Копируем их в изображения в папке с результатом
        .pipe(app.gulp.dest(app.path.build.images))
        // Обновляем браузер
        .pipe(app.plugins.browsersync.stream());

}