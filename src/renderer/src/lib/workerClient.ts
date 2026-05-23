const WORKER_URL = import.meta.env.VITE_WORKER_URL as string

if (!WORKER_URL) {
  throw new Error(
    '[workerClient] VITE_WORKER_URL is not defined. Add it to your .env file and restart the dev server.'
  )
}

export interface OrgCredentials {
  orgId: string
  orgName: string
  supabaseUrl: string
  supabaseAnonKey: string
}

export class WorkerError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'WorkerError'
  }
}

export async function fetchOrgCredentials(
  clerkToken: string,
  orgId: string
): Promise<OrgCredentials> {
  const url = `${WORKER_URL}/org/credentials`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${clerkToken}`,
        'X-Org-Id': orgId,
        'Content-Type': 'application/json'
      }
    })
  } catch (networkErr) {
    // Fetch itself failed — worker URL unreachable
    throw new WorkerError(`Worker unreachable at ${url}: ${networkErr}`, 0)
  }

  // Read as text first so we never crash on non-JSON responses
  const raw = await response.text()

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw)
  } catch {
    // Worker returned HTML — surface the raw response for debugging
    console.error('[workerClient] Non-JSON response from worker:', raw.slice(0, 300))
    throw new WorkerError(
      `Worker returned a non-JSON response (status ${response.status}). Check that VITE_WORKER_URL is correct and the worker is deployed.`,
      response.status
    )
  }

  if (!response.ok) {
    throw new WorkerError(
      (body.error as string) ?? 'Failed to fetch org credentials',
      response.status
    )
  }

  return body as unknown as OrgCredentials
}
