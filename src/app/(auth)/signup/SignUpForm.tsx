"use client"


import { SignUpSchema, SignUpValues } from '@/lib/validation'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUp } from './actions'
import { PasswordInput } from '@/components/PasswordInput'
import LoadingButton from '@/components/LoadingButton'




export const SignUpForm = () => {


    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()


    const form = useForm<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: '',
            username: '',
            password: ''
        }
    })

    function onSubmit(values: SignUpValues) {
        setError(undefined)
        startTransition(async () => {
            const { error } = await SignUp(values)
            if (error) setError(error)
        }) 
    }


  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        {error && <p className='text-center text-destructive'>{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type='submit' className='w-full'>
            Create Account
        </LoadingButton>
        </form>
    </Form>
  )
}
