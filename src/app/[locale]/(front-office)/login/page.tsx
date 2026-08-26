import { SignInButton } from './sign-in-button';

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">CV Studio</h1>
      <p className="mt-2 max-w-sm text-center text-muted-foreground">
        Crea y gestiona tus currículos con vista previa en tiempo real y
        almacenamiento en Google Drive.
      </p>
      <SignInButton />
    </div>
  );
}
