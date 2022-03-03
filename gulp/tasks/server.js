export const server = (done) => {
    app.plugins.browsersync.init({
        server: {
            //Базовая папка откуда нужно запустить файлы
            //Отслеживаем HTML файл
            baseDir: `${app.path.build.html}`
        },
        // Отключение мешающих уведомлений
        notify: false,
        // Указывается порт для локального сервера
        port: 3000,
    })
}