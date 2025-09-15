// src/api/email.ts
export interface JobApplicationData {
  fullName: string
  email: string
  phone: string
  course: string
  year: string
  experience: string
  jobRole: string
  whyJoin: string
  skills: string
  resume: File | null
}

export async function sendJobApplication(data: JobApplicationData): Promise<boolean> {
  try {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value as any)
      }
    })

    const response = await fetch("/api/send-application", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to send application")
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error("Error sending job application:", error)
    return false
  }
}
