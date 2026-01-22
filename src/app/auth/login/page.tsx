
"use client";
import {api} from "@/trpc/react";
import { RequestOtpForm } from "@/components/auth/login/request-otp-form";

export default function Home() {
    return <RequestOtpForm />;
}
