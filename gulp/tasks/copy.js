export const copy = () => {
    //Получаем доступ к файлам и папкам по указанному пути
    return app.gulp.src(app.path.src.files)
    //Переносим в папку назначения
    .pipe(app.gulp.dest(app.path.build.files))
}