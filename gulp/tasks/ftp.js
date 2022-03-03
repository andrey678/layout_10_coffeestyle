// Подключаем конфигурационный файл из папки gulp/config
import { configFTP } from '../config/ftp.js';
// Плагин для отправки на FTP сервер
import vinylFTP from 'vinyl-ftp';
// Плагин с утилитами для отображения хода отправки на сервер
import util from 'gulp-util';

export const ftp = () => {
    //Для вывода состояния выполнения
    configFTP.log = util.log;
    // Создаём подключение ftpConnect основываясь на файле конфигураци configFTP
    const ftpConnect = vinylFTP.create(configFTP);
    // Получаем все файлы и папки в папке с результатом
    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
    //Отрабатываем ошибки
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FTP",
                message: "Error: <% error.message %>"
            })
        ))
        // Указываем путь назначения для ftpConnect(путь(папка) к удалённому серверу указанный в файле path / название root папки) 
        .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`));
}