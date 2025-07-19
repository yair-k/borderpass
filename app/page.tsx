import SurveyContainer from "@/components/survey-container"
import BackgroundEffects from "@/components/background-effects"
import TechnicalAssessmentBadge from "@/components/technical-assessment-badge"
import questions from "@/data/questions.json"

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <BackgroundEffects />
      <TechnicalAssessmentBadge />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <SurveyContainer questions={questions} />
      </div>
    </main>
  )
}
