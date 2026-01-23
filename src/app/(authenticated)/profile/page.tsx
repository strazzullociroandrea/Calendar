"use client";
import {authClient} from "@/lib/auth-client";
import {ProfileGroup} from "@/components/profile/profile";

export default function Profile() {


    return (
        <div className="min-h-screen">
            <div className="container mx-auto h-full px-4 sm:px-6 py-6">
                {/* Header: titolo + pulsante */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-light text-foreground flex-1">
                        Impostazioni profilo
                    </h1>
                </div>
                <ProfileGroup/>

            </div>
        </div>
    );
}