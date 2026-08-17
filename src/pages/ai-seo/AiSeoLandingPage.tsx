import { useEffect } from "react"

import LandingAiSeo from "@/registry/creght/landing/landing-ai-seo/landing-ai-seo"

export function AiSeoLandingPage() {
  useEffect(() => {
    const previousTitle = document.title
    const previousLanguage = document.documentElement.lang
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = description?.content

    document.title = "AI SEO — Boost your rankings with AI"
    document.documentElement.lang = "en"
    description?.setAttribute(
      "content",
      "AI-powered SEO tools for goal setting, keyword research, optimization, reporting, and monitoring.",
    )

    return () => {
      document.title = previousTitle
      document.documentElement.lang = previousLanguage
      if (description && previousDescription !== undefined) {
        description.content = previousDescription
      }
    }
  }, [])

  return <LandingAiSeo />
}
