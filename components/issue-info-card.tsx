import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, Zap } from "lucide-react"

interface IssueInfoCardProps {
  reportedBy?: string
  authority?: string
  severity: number
}

export function IssueInfoCard({ reportedBy, authority, severity }: IssueInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportedBy && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Reported By</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <p className="font-medium text-sm">{reportedBy}</p>
            </div>
          </div>
        )}

        {authority && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">
              Assigned Authority
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-medium text-sm">{authority}</p>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Severity Level</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-600" />
            </div>
            <p className="font-medium text-sm">{severity}% Critical</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
