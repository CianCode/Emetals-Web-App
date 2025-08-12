import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// your auth instance

export default async function TestPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <h1>Session Test</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
