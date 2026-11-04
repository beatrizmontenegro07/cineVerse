'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { ApiError } from '../../../lib/api';
import { useAuth } from '../auth-provider';

const fieldClass =
  'mt-2 min-h-12 w-full rounded-lg border border-[#4c3a60] bg-[#100d18] px-4 text-sm focus:border-accent';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const { user, status, login, register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const destination =
    next === '/' || next === '/meus-filmes' ? next : '/meus-filmes';
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string[]>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    setFields({});
    const credentials = {
      username: String(data.get('username') ?? '').trim(),
      password: String(data.get('password') ?? ''),
    };
    try {
      if (registering)
        await register({
          ...credentials,
          email: String(data.get('email') ?? ''),
          password_confirmation: String(
            data.get('password_confirmation') ?? '',
          ),
        });
      else await login(credentials);
      router.replace(destination);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível acessar sua conta.',
      );
      if (error instanceof ApiError && error.fields) setFields(error.fields);
    } finally {
      setPending(false);
    }
  }

  if (status === 'ready' && user)
    return (
      <section className="mx-auto max-w-md px-5 py-14">
        <h1 className="text-2xl font-bold">Você já está conectado.</h1>
        <Link
          href={destination}
          className="mt-5 inline-block rounded text-accent underline"
        >
          Continuar
        </Link>
      </section>
    );
  const inputs = [
    {
      name: 'username',
      label: 'Nome de usuário',
      type: 'text',
      autoComplete: 'username',
      max: 150,
      required: true,
    },
    ...(registering
      ? [
          {
            name: 'email',
            label: 'E-mail (opcional)',
            type: 'email',
            autoComplete: 'email',
            max: 254,
            required: false,
          },
        ]
      : []),
    {
      name: 'password',
      label: 'Senha',
      type: 'password',
      autoComplete: registering ? 'new-password' : 'current-password',
      max: 128,
      required: true,
    },
    ...(registering
      ? [
          {
            name: 'password_confirmation',
            label: 'Confirme a senha',
            type: 'password',
            autoComplete: 'new-password',
            max: 128,
            required: true,
          },
        ]
      : []),
  ];
  return (
    <section className="mx-auto w-full max-w-md px-5 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        {registering ? 'Crie sua conta' : 'Entre na sua conta'}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        {registering
          ? 'Salve suas avaliações e leve seus filmes favoritos com você.'
          : 'Seus filmes e suas avaliações, em qualquer lugar.'}
      </p>
    <form method="post" onSubmit={submit} className="mt-8 space-y-5">
        <fieldset
          disabled={pending || status === 'loading'}
          className="space-y-5"
        >
          {inputs.map((input) => (
            <div key={input.name}>
              <label htmlFor={input.name} className="text-sm font-medium">
                {input.label}
              </label>
              <input
                id={input.name}
                name={input.name}
                type={input.type}
                autoComplete={input.autoComplete}
                maxLength={input.max}
                required={input.required}
                aria-invalid={Boolean(fields[input.name])}
                aria-describedby={
                  fields[input.name] ? `${input.name}-error` : undefined
                }
                className={fieldClass}
              />
              {fields[input.name] && (
                <p
                  id={`${input.name}-error`}
                  className="mt-2 text-xs leading-5 text-[#e4b8ce]"
                >
                  {fields[input.name].join(' ')}
                </p>
              )}
            </div>
          ))}
          {registering && (
            <p className="text-xs leading-5 text-muted">
              Use ao menos 8 caracteres. Evite senhas comuns, somente numéricas
              ou parecidas com seu nome.
            </p>
          )}
          <button
            type="submit"
            className="min-h-12 w-full rounded-full bg-[#a36aff] px-5 text-sm font-semibold text-[#160a29] transition hover:bg-[#b785ff] disabled:opacity-50"
          >
            {pending ? 'Aguarde…' : registering ? 'Criar conta' : 'Entrar'}
          </button>
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-[#e4b8ce]">
            {error}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {registering ? 'Já tem uma conta? ' : 'Ainda não tem uma conta? '}
        <Link
          href={`${registering ? '/login' : '/cadastro'}?next=${encodeURIComponent(destination)}`}
          className="rounded font-medium text-accent underline-offset-4 hover:underline"
        >
          {registering ? 'Entrar' : 'Criar conta'}
        </Link>
      </p>
    </section>
  );
}
