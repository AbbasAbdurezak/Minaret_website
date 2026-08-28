type SanityQueryParams = Record<string, string | number | boolean>;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export async function sanityFetch<T>(
  query: string,
  params: SanityQueryParams = {}
): Promise<T | null> {
  if (!projectId) {
    return null;
  }

  const search = new URLSearchParams({ query });

  Object.entries(params).forEach(([key, value]) => {
    search.set(`$${key}`, String(value));
  });

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?${search.toString()}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    throw new Error(`Sanity request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { result: T };
  return payload.result;
}
