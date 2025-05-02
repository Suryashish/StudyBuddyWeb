'use client';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter
// import { useSearchParams } from 'next/navigation';
import {toast} from 'react-toastify'
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const URL = process.env.NEXT_PUBLIC_VITE_BE_URL;
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Email and password are required for login!');
      return;
    }

    try {
      const res = await fetch(`${URL}/loginUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify(data));

        router.push(`/dashboard/${data._id}`); // Redirect to dashboard page
      } else {
        if (data.error === 'Invalid email or password') {
          toast.error('Invalid email or password!');
        } else if (data.error === 'User not found') {
          toast.error('User not found!');
        } else {
          toast.error('Something went wrong. Please try again later.');
        }
      }
    } catch (err:any) {
      toast.error(`Something went wrong. ${err.message}. Please try again later.`);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password below to sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>
            Sign In
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <Link href="#" className="underline">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}