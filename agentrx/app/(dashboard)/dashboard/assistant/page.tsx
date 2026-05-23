import { Bot, Send, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AssistantPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="min-h-[620px] rounded-2xl">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>
            AgentShefa assistant workspace. The Python agent service can be
            connected here later.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex min-h-[500px] flex-col justify-between">
          <div className="space-y-4">
            <div className="max-w-2xl rounded-2xl bg-slate-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="size-4 text-slate-700" />
                <p className="text-sm font-medium">AgentShefa</p>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                I&apos;m ready to support prescription workflow summaries,
                document review, medication organization, and pharmacist review
                queues once the agent service is connected.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask about a workflow, patient, or prescription..."
              className="h-11 rounded-xl"
            />

            <Button className="h-11 rounded-xl">
              <Send className="mr-2 size-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Safety Rules</CardTitle>
          <CardDescription>
            Enterprise guardrails for healthcare-style workflows.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {[
            "Do not replace pharmacist judgment.",
            "Always show uncertainty when medical context is incomplete.",
            "Require human review before medication decisions.",
            "Log AI activity for auditability.",
          ].map((rule) => (
            <div key={rule} className="flex gap-3 rounded-2xl border p-4">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p className="text-sm text-slate-600">{rule}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}