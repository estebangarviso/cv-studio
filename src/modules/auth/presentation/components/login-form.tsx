'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '../hooks/use-auth';

const loginSchema = z.object({
	email: z.string().email('Enter a valid email address.'),
	password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const { login, isLoading, error } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = handleSubmit(async (values) => {
		await login(values);
	});

	return (
		<form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
			<div>
				<label htmlFor="email" className="block text-sm font-medium">
					Email
				</label>
				<input
					id="email"
					type="email"
					autoComplete="email"
					{...register('email')}
					className="mt-1 block w-full rounded border px-3 py-2"
					aria-invalid={errors.email ? 'true' : 'false'}
					aria-describedby={errors.email ? 'email-error' : undefined}
				/>
				{errors.email && (
					<p
						id="email-error"
						role="alert"
						className="mt-1 text-sm text-red-600"
					>
						{errors.email.message}
					</p>
				)}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium">
					Password
				</label>
				<input
					id="password"
					type="password"
					autoComplete="current-password"
					{...register('password')}
					className="mt-1 block w-full rounded border px-3 py-2"
					aria-invalid={errors.password ? 'true' : 'false'}
					aria-describedby={
						errors.password ? 'password-error' : undefined
					}
				/>
				{errors.password && (
					<p
						id="password-error"
						role="alert"
						className="mt-1 text-sm text-red-600"
					>
						{errors.password.message}
					</p>
				)}
			</div>

			{error && (
				<p id="auth-error" role="alert" className="text-sm text-red-600">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	);
}
