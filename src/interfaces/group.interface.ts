import { DayWeek } from '@/interfaces/utils/DayWeek.interface';
interface Group {
    id_group?: number,
    name_group: string,
    created_group: string,
    day_payment_name?: string,
    day_payment: DayWeek,
    slug?: string,
    id_beneficiary?: number,
    state_archived_group?: boolean
}


export {
    Group,

}