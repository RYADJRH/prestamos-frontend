import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es-mx';

dayjs.extend(localizedFormat)
dayjs.locale('es-mx');

const formatDate = (date: string, format: string): string => {
    return dayjs(date).format(format);
}

export {
    formatDate
}
