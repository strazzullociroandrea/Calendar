"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";

export function Footer() {
    return (
        <div className="text-muted-foreground font-light mt-6">
            <p className="text-sm flex justify-center items-center gap-1">
                <span>Non hai un account?</span>
                <Link href="/auth/register" passHref>
                    <Button
                        variant="link"
                        className="bg-gradient-to-br from-orange-400 to-yellow-500 bg-clip-text text-transparent font-medium hover:underline p-0"
                    >
                        Registrati
                    </Button>
                </Link>
            </p>
        </div>
    );
}