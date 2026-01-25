import {cn} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";

export function SelectedDayInfo({className, selectedDate, onSelectDate, events}: {
    className?: string;
    selectedDate?: Date;
    onSelectDate?: (date: Date) => void;
    events?: string[];
}) {
    return (
        <Card className={cn("h-full", className)}>
            <CardContent className="h-full">
                <div className="w-full h-full flex flex-col bg-background rounded-lg   p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="font-light text-white">
                             Eventi del giorno {selectedDate ? selectedDate.toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit', year: '2-digit'}) : 'Nessun giorno selezionato'}
                        </h4>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}