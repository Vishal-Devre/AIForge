import { CreditCard, Receipt, ArrowUpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/lib/ui/card'
import { Button } from '@/lib/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'

export function BillingPage() {
  const billingHistory: any[] = [] // Empty for now to show the empty state

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription, credits, and billing history"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Free Tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">$0.00 <span className="text-sm font-normal text-[var(--text-tertiary)]">/ month</span></p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Includes basic agent creation and shared GPU instances.</p>
              </div>
              <Button>
                <ArrowUpCircle className="h-4 w-4 mr-2" /> Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
            <CardDescription>Available computing credits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--accent)]">500</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Credits remaining this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={<Receipt className="h-8 w-8" />}
                title="No billing history"
                description="Upgrade your plan."
                action={<Button variant="outline"><CreditCard className="h-4 w-4 mr-2" /> Add Payment Method</Button>}
              />
            </div>
          ) : (
            <div>{/* List invoices here */}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
