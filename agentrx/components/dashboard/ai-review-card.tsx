import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  
  export function AiReviewCard() {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>AI Review Progress</CardTitle>
          <CardDescription>
            Today&apos;s automated pharmacy workflow checks.
          </CardDescription>
        </CardHeader>
  
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Interaction checks</span>
              <span className="font-medium">92%</span>
            </div>
            <Progress value={92} />
          </div>
  
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Document extraction</span>
              <span className="font-medium">76%</span>
            </div>
            <Progress value={76} />
          </div>
  
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Pharmacist approvals</span>
              <span className="font-medium">61%</span>
            </div>
            <Progress value={61} />
          </div>
        </CardContent>
      </Card>
    )
  }