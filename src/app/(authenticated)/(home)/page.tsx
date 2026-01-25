"use client";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {CalendarGrid} from "@/components/home/calendar-grid";
import {SelectedDayInfo} from "@/components/home/selected-day-info";

export default function Home() {
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    return (
        <div className="min-h-screen  ">
             <div className="container mx-auto flex flex-col h-screen px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-light text-foreground flex-1">
                        Il tuo calendario
                    </h1>

                    <Button
                        variant="secondary"
                        onClick={() => router.push('/createEvent')}
                        className="min-w-[100px] font-light shadow-xs"
                    >
                        <span className="ml-2 mr-2 text-white">+</span>
                        <span className="flex-1 text-white">Nuovo evento</span>
                    </Button>


                </div>

                 <div className="flex flex-1 flex-col md:flex-row gap-6 min-h-0">
                     <div className="w-full md:w-8/12  rounded-lg shadow overflow-hidden flex-1 min-h-0">
                        <CalendarGrid
                            className="p-5"
                            selectedDate={selectedDate}
                            onSelectDate={(date: Date) => setSelectedDate(date)}
                        />
                    </div>

                     <div className="w-full md:w-4/12 sm:pl-4">
                        <SelectedDayInfo
                            selectedDate={selectedDate}
                            onSelectDate={(date: Date) => setSelectedDate(date)}
                        />

                    </div>

                </div>
            </div>
        </div>
    )
}