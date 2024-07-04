"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { handleAuthCallback } from "./actions";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const { data, isLoading } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => await handleAuthCallback(),
  });

  console.log(data);
  if (data?.success) router.push("/");
  return (
    <section className="min-h-[90vh] flex items-center justify-center flex-col max-w-7xl w-full mx-auto">
      <div className="flex flex-col items-center">
        <Loader className="size-16 mb-5 animate-spin text-primaryCol" />
        <h2 className="text-4xl font-bold mb-2">Redirecting...</h2>
        <p className="text-lg font-semibold">Please wait</p>
      </div>
    </section>
  );
};

export default AuthCallbackPage;
