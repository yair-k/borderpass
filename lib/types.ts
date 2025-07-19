export type Question = {
  id: string
  type: "welcome" | "submission" | "short_text" | "long_text" | "radio" | "checkbox" | "dropdown" | "rating" | "date"
  title: string
  subtitle?: string
  required?: boolean
  options?: string[]
  input_type?: string
  max?: number
}

export type Responses = Record<string, any>
