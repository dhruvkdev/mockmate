import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
function CreateInterviewDialog() {

    const [formData, setFormData]=useState<any>();
    const onHandleInputChange=(field:string, value:string)=>{
        setFormData((prev: any)=>({
            ...prev,
            [field]:value
        }))
    }
    return (
        <Dialog>
            <DialogTrigger>
                <Button>+ Create Interview</Button>
            </DialogTrigger>
            <DialogContent className='min-w-3xl'>
                <DialogHeader>
                    <DialogTitle>Plese submit the following details.</DialogTitle>
                    <DialogDescription>
                        <Tabs defaultValue="resume-upload" className="w-full mt-2">
                            <TabsList>
                                <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
                                <TabsTrigger value="job-description">Job Description </TabsTrigger>
                            </TabsList>
                            <TabsContent value="resume-upload"><ResumeUpload /></TabsContent>
                            <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange}/></TabsContent>
                        </Tabs>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'ghost'}>Cancel</Button>
                    </DialogClose>
                    <Button>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateInterviewDialog