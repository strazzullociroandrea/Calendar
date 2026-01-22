"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";


export default function VerifyOtpPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");


    if(!email) return router.push("/auth/login");

    return <VerifyOtpForm email={email} />;

};