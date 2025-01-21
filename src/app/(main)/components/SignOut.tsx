"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOut = () => {
  return (
    <Button
      onClick={() => signOut()}
      className={buttonVariants({ variant: "destructive" })}
    >
      Sign Out
    </Button>
  );
};
