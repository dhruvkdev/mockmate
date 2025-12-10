import { div, label } from 'motion/react-client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function JobDescription({ onHandleInputChange }: any) {
  return (
    <div className='border rounded-2xl p-7'>
      <div>
        <label htmlFor="job-title">Job Title</label>
        <Input
          placeholder="Ex. Full Stack Developer"
          onChange={(event) =>
            onHandleInputChange("jobTitle", event.target.value)
          }
        />
      </div>

      <div className='mt-5'>
        <label htmlFor="job-description">Job Description</label>
        <Textarea
          className="min-h-50"
          placeholder="Enter or paste job description."
          onChange={(event) =>
            onHandleInputChange("jobDescription", event.target.value)
          }
        />
      </div>
    </div>
  )
}

export default JobDescription
