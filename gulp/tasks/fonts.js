//Плагин для работы с файловой системой
import fs from 'fs';
//Плагин для преобразования шрифта из формата OTF в формат TTF или WOFF
import fonter from 'gulp-fonter';
//Плагин для преобразования шрифта из формата OTF в формат TTF2 или WOFF2
import ttf2woff2 from 'gulp-ttf2woff2';


// Конвертация otf в Ttf
export const otfToTtf = () => {
    // Обращаемся к папке с исходниками и ищем файлы шрифтов .otf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // Конвертирует в .ttf
        .pipe(fonter({
            formats: ['ttf']
        }))
        // Выгружаем в исходную папку
        .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

// Конвертация ttf в Woff
export const ttfToWoff = () => {
    // Обращаемся к папке с исходниками и ищем файлы шрифтов .ttf
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
            })
        ))
        // Конвертируем в .woff
        .pipe(fonter({
            formats: ['woff']
        }))
        // Выгружаем в папку с результатом
        .pipe(app.gulp.dest(`${app.path.build.fonts}`))
        // Ищем файлы шрифтов .ttf
        .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
        // Конвертируем в .woff2
        .pipe(ttf2woff2())
        // Выгружаем в папку с результатом
        .pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

// Подключение файлов шрифтов в файл стилей
export const fontsStyle = () => {
    // Файл стилей подключения шрифтов(получаем доступ к файлу) 
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // Проверяем существуют ли файлы шрифтов(мы не всегда будем получать файлы локально)
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // Проверяем существует ли файл стилей fonts.scss для подключения шрифтов
            if (!fs.existsSync(fontsFile)) {
                // Если файла нет, то создаём его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                // Проходим по всем файлам шрифтов чтобы их записать
                // И проверяем уникальность файла так,как там woff и woff2
                for (var i = 0; i < fontsFiles.length; i++) {
                    //Записываем подключения шрифтов в файл стилей
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        // Определяем font-weight шрифта
                        if (fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100;
                        } else if (fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200;
                        } else if (fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300;
                        } else if (fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500;
                        } else if (fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600;
                        } else if (fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700;
                        } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                            fontWeight = 800;
                        } else if (fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900;
                        } else {
                            fontWeight = 400;
                        }
                        //Формируем код для подключения шрифта и пишем его в файл
                        fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                // Если файл есть выводим сообщение
                // Сделано для тех случаев, когда нужно буде вносить в файл какие-то изменения
                // и чтобы gulp не перезаписывал файл,построена такая проверка
                console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!");
            }
        }
    });
    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
}