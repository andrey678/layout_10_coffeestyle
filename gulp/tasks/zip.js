//Плагин для удаления
import del from 'del';
//Плагин для создания архива
import zipPlugin from 'gulp-zip';

export const zip = () => {
    //Удаляем zip архив,если он существует
    del(`./${app.path.rootFolder}.zip`);
    //Обращаемся к папке с результатом и получаем все файлы любого уровня вложенности
    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
    // Обрабатываем ошибки
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "ZIP",
                message: "Error: <%= error.message %>" 
            })
        ))
        // Создаём архив c именем корневой папки
        .pipe(zipPlugin(`${app.path.rootFolder}.zip`))
        // Переносим результат в корень проекта
        .pipe(app.gulp.dest('./'));
}