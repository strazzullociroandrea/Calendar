import {PersonalInformation} from "@/components/profile/personal-information";
import {PersonalSession} from "@/components/profile/personal-session";
import {DangerZone} from "@/components/profile/danger-zone";

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