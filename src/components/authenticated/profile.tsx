import {PersonalInformation} from "@/components/authenticated/personal-information";
import {PersonalSession} from "@/components/authenticated/personal-session";
import {DangerZone} from "@/components/authenticated/danger-zone";

export function ProfileGroup() {
    return (
        <div className="mx-auto max-w-3xl px-4 space-y-6">
            <section>
                <PersonalInformation />
            </section>
            <section>
                <PersonalSession />
            </section>
            <section>
                <DangerZone />
            </section>
        </div>
    );
}