
enum DayWeek {
    Lunes = 1,
    Martes = 2,
    Miercoles = 3,
    Jueves = 4,
    Viernes = 5,
    Sabado = 6,
    Domingo = 7,
}

type DaysNames = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';


function lockDays(day: DayWeek): number[] {
    const dayNumbers = [0, 1, 2, 3, 4, 5, 6];
    let dayNum = 0;
    if (day != DayWeek.Domingo)
        dayNum = day
    return dayNumbers.filter((day) => day !== dayNum);
}

export {
    DayWeek,
    DaysNames,
    lockDays
}