const messages: Record<string, string> = {
  tmdb_not_configured:
    'O serviço de filmes está temporariamente indisponível. Tente novamente mais tarde.',
  tmdb_rate_limited:
    'Muitas consultas no momento. Aguarde um pouco e tente novamente.',
  tmdb_timeout: 'A consulta demorou mais que o esperado. Tente novamente.',
  invalid_parameters:
    'Não foi possível concluir a solicitação. Confira os dados e tente novamente.',
  movie_not_found: 'Este filme não foi encontrado.',
  rating_not_found:
    'Esta avaliação não foi encontrada. Ela pode ter sido removida em outra aba.',
  rating_exists:
    'Este filme já foi avaliado. Reabra os detalhes para atualizar a nota.',
  csrf_failed: 'Não foi possível validar sua sessão. Tente novamente.',
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export async function requestJson<T>(
  url: string,
  validate: (value: unknown) => value is T,
  options: RequestOptions = {},
): Promise<T> {
  const response = await sendRequest(url, options);
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      'O serviço retornou uma resposta inválida. Tente novamente.',
      response.status,
    );
  }
  if (!response.ok) {
    const code = (data as { error?: { code?: string } } | null)?.error?.code;
    throw new ApiError(
      (code && messages[code]) ||
        'Não foi possível concluir a solicitação. Tente novamente.',
      response.status,
      code,
    );
  }
  if (!validate(data))
    throw new ApiError(
      'O serviço retornou uma resposta inválida. Tente novamente.',
      response.status,
    );
  return data;
}

async function sendRequest(
  url: string,
  options: RequestOptions,
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  try {
    return await fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(15_000)])
        : AbortSignal.timeout(15_000),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(
      'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.',
      0,
    );
  }
}

export async function requestEmpty(
  url: string,
  options: RequestOptions,
): Promise<void> {
  const response = await sendRequest(url, options);
  if (response.status === 204) return;
  let code: string | undefined;
  try {
    code = (await response.json())?.error?.code;
  } catch {
    /* Use the fallback error for a non-JSON response. */
  }
  throw new ApiError(
    (code && messages[code]) ||
      'Não foi possível excluir a avaliação. Tente novamente.',
    response.status,
    code,
  );
}
