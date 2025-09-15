// Email service for sending job applications
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

    // Add all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value)
      }
    })

    // In a real application, you would send this to your backend API
    // For now, we'll simulate the email sending process

    // Example backend endpoint call:
    // const response = await fetch('/api/send-application', {
    //   method: 'POST',
    //   body: formData,
    // });

    // For demonstration, we'll use EmailJS or similar service
    // You can replace this with your preferred email service

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Log the application data (in production, this would be sent via email)
    console.log("Job Application Submitted:", {
      applicant: data.fullName,
      email: data.email,
      phone: data.phone,
      position: data.jobRole,
      resume: data.resume?.name || "No resume uploaded",
    })

    return true
  } catch (error) {
    console.error("Error sending job application:", error)
    return false
  }
}

// Alternative implementation using EmailJS (uncomment to use)
/*
import emailjs from '@emailjs/browser';

export async function sendJobApplicationWithEmailJS(data: JobApplicationData): Promise<boolean> {
  try {
    // Initialize EmailJS with your public key
    emailjs.init('YOUR_PUBLIC_KEY');
    
    const templateParams = {
      to_email: 'hr@ascendio.com', // Your email address
      from_name: data.fullName,
      from_email: data.email,
      phone: data.phone,
      course: data.course,
      year: data.year,
      experience: data.experience,
      job_role: data.jobRole,
      why_join: data.whyJoin,
      skills: data.skills,
      // Note: File attachments require special handling with EmailJS
    };
    
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
}
*/
