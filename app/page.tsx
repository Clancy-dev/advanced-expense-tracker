import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Track Your Finances with Ease</h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Manage your expenses, track your income, and plan your budget all in one place. Take control of your financial
          future today.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard
          title="Track Expenses"
          description="Record and categorize your expenses to understand your spending habits."
        />
        <FeatureCard
          title="Manage Income"
          description="Keep track of all your income sources in one convenient place."
        />
        <FeatureCard
          title="Plan Your Budget"
          description="Create budgets for different categories and track your progress."
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-xl font-medium text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  )
}
