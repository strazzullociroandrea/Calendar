"use client";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {CalendarGrid} from "@/components/home/calendar-grid";
import {SelectedDayInfo} from "@/components/home/selected-day-info";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Card, CardContent} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {emailLoginSchema} from "@/lib/schemas/auth-schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {eventSchemas} from "@/lib/schemas/event-schemas";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export default function CreateEvent() {
    const router = useRouter();

    const form = useForm<z.infer<typeof eventSchemas>>({
        resolver: zodResolver(eventSchemas),
        defaultValues: {
            title: "",
            details: "",
            when: ""
        },
    });

    return (
        <div className="min-h-screen  ">
            <div className="container mx-auto flex flex-col h-screen px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-light text-foreground flex-1">
                        Crea il tuo evento
                    </h1>


                </div>
                <Card className="flex flex-1 flex-col md:flex-row gap-6 min-h-0">
                    <CardContent className="w-full ">
                        <p className="text-lg text-muted-foreground mb-6 font-light">Compila i dati per creare il tuo
                            evento</p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(() => {
                                })}
                                className="w-full"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({field}) => (
                                            <FormItem className="mt-5 flex-1"> {/* Usa flex-1 invece di w-full mr-4 */}
                                                <FormLabel className="text-sm font-light text-muted-foreground">
                                                    Titolo Evento
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Dare da mangiare al cane.."
                                                        {...field}
                                                        className="font-light"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="when"
                                        render={({field}) => (
                                            <FormItem className="mt-5 flex-1">
                                                <FormLabel className="text-sm font-light text-muted-foreground">
                                                    Data e Ora
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        {...field}
                                                        className="font-light"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="details"
                                    render={({field}) => (
                                        <FormItem className="mt-4 w-full">
                                            <FormLabel
                                                className="text-sm font-light text-muted-foreground">Gruppo</FormLabel>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Gruppo associato" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="-">-</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="details"
                                    render={({field}) => (
                                        <FormItem className="mt-4 w-full">
                                            <FormLabel
                                                className="text-sm font-light text-muted-foreground">Descrizione</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="...."
                                                    {...field}
                                                    className="w-full font-light h-40"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            router.back();
                                        }} variant="outline" className="mt-6">
                                        Annulla
                                    </Button>
                                    <Button type="submit" variant="secondary" className="mt-6">
                                        Crea Evento
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}