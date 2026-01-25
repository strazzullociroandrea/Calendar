import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {Button} from "@/components/ui/button";


function formatDateISOLocal(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function CalendarGrid({className, selectedDate, onSelectDate, events}: {
    className?: string;
    selectedDate?: Date;
    onSelectDate?: (date: Date) => void;
    events?: string[];
}) {

    const today = new Date();
    const [current, setCurrent] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const [internalSelectedDay, setInternalSelectedDay] = useState<number | null>(
        null
    );
    const getMonthName = (date: Date) => date.toLocaleString('it-IT', {month: 'long'});

    const giorniDelMeseDaData = (data: Date) => new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();

    const prevMonth = () => {
        setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
        setInternalSelectedDay(null);
    }

    const nextMonth = () => {
        setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
        setInternalSelectedDay(null);
    }

    const handleSelectDay = (dayNumber: number) => {
        const date = new Date(current.getFullYear(), current.getMonth(), dayNumber);
        setInternalSelectedDay(dayNumber);
        onSelectDate?.(date);
    }

    const year = current.getFullYear();
    const monthName = getMonthName(current);
    const daysInMonth = giorniDelMeseDaData(current);
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
    const leadingEmpty = (firstDay + 6) % 7;
    const cellsCount = leadingEmpty + daysInMonth;

    return (
        <Card className={cn("h-full", className)}>

            <CardContent className="h-full">
                <div className="w-full h-full flex flex-col bg-background rounded-lg   p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-lg sm:text-xl font-light text-white">
                            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                aria-label="Mese precedente"
                                onClick={prevMonth}
                                className="p-2 rounded-md hover:bg-neutral-100 transition bg-neutral-50 border border-transparent hover:border-neutral-200"
                            >
                                ‹
                            </Button>
                            <Button
                                variant="outline"
                                aria-label="Oggi"
                                onClick={() => {
                                    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));
                                    setInternalSelectedDay(today.getDate());
                                }}
                                className="font-medium px-3 py-1.5 rounded-md bg-transparent hover:bg-neutral-50 transition "
                            >
                                Oggi
                            </Button>
                            <Button
                                variant="outline"
                                aria-label="Mese successivo"
                                onClick={nextMonth}
                                className="p-2 rounded-md hover:bg-neutral-100 transition bg-neutral-50 border border-transparent hover:border-secondary/4"
                            >
                                ›
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm mb-3">
                        {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
                            <div
                                key={day}
                                className="font-medium px-1 py-2 text-neutral-500 uppercase tracking-wider text-[11px]"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center flex-1">
                        {Array.from({length: cellsCount}).map((_, index) => {
                            const dayNumber = index - leadingEmpty + 1;
                            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

                            const isToday = isCurrentMonth
                                && dayNumber === today.getDate()
                                && current.getMonth() === today.getMonth()
                                && current.getFullYear() === today.getFullYear();

                            const isSelected = isCurrentMonth && dayNumber === internalSelectedDay;

                            const classToday = isToday ? "bg-secondary/10 text-secondary font-medium  border-secondary hover:text-white" : "";

                            const variant = () => {
                                if (isToday)
                                    return "secondary";
                                if (internalSelectedDay === dayNumber)
                                    return "default";
                                return "ghost";
                            }
                            return (
                                <Button
                                    key={index}
                                    variant={variant()}
                                    className={classToday + " h-15 w-full p-1 flex flex-col items-center justify-center rounded-md text-sm sm:text-base"}
                                    disabled={!isCurrentMonth}
                                    onClick={() => handleSelectDay(dayNumber)}
                                >
                                    {isCurrentMonth && (

                                        <><span className="leading-none text-white font-light">
                                            {dayNumber}
                                        </span>
                                            <div
                                                className="mt-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-white shadow-sm">
                                                +1
                                            </div>
                                        </>
                                    )}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </CardContent>

        </Card>
    )
}

