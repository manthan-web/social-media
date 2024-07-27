"use client";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Login } from "./actions";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await Login(values);
      if (error) setError(error);
    });
  }

  return (
    // <Form {...form}>
    //   <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
    //     {error && <p className="text-center text-destructive">{error}</p>}
    //     <FormField
    //       control={form.control}
    //       name="username"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Username</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Username" {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="password"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Password</FormLabel>
    //           <FormControl>
    //             <PasswordInput placeholder="Password" {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <LoadingButton loading={isPending} type="submit" className="w-full">
    //       Login
    //     </LoadingButton>
    //   </form>
    // </Form>
    <div>
      login
    </div>
  );
};

export default LoginForm;
