import { jsonOk } from "@/lib/api/http"
import { getEvents } from "@/services/content-service"

export const dynamic = "force-dynamic"

export async function GET() {
  return jsonOk({ items: await getEvents() })
}
