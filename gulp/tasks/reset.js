//Подключение плагина del
import del from "del";
// Удаление папки с результатом
export const reset = () => {
    return del(app.path.clean);
}