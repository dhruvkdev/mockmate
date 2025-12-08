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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
import axios from 'axios'
function CreateInterviewDialog() {

    const [formData, setFormData]=useState<any>();
    const onHandleInputChange=(field:string, value:string)=>{
        setFormData((prev: any)=>({
            ...prev,
            [field]:value
        }))
    }
    const [file, setFile]=useState<File|null>();
    const [loading, setLoading] = useState(false);
    const onSubmit = async()=>{
        if(!file)return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post('api/generate-interview-questions', formData);
            console.log(res.data);
            
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
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
                            <TabsContent value="resume-upload"><ResumeUpload setFiles={(file:File)=>setFile(file)}/></TabsContent>
                            <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange}/></TabsContent>
                        </Tabs>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={'ghost'}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={loading || !file}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateInterviewDialog