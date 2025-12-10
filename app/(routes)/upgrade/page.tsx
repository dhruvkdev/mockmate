"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PricingTable } from '@clerk/nextjs'

function Upgrade() {
    const router = useRouter()

    return (
        <div className='min-h-screen bg-gray-50 py-12 px-4'>
            <div className='max-w-6xl mx-auto'>
                {/* Header Section */}
                <div className='mb-12'>
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                        className='mb-6 hover:bg-gray-100'
                    >
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Back to Dashboard
                    </Button>

                    <div className='text-center'>
                        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                            Choose Your Plan
                        </h1>
                        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                            Upgrade your interview preparation with advanced features.
                            All plans include AI-powered feedback and comprehensive analytics.
                        </p>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12'>
                    <PricingTable />
                </div>

                {/* Additional Info */}
                <div className='mt-12 text-center'>
                    <p className='text-sm text-gray-500 mb-4'>
                        All plans come with a 14-day money-back guarantee
                    </p>
                    <div className='flex flex-wrap justify-center gap-6 text-sm text-gray-600'>
                        <span>✓ Cancel anytime</span>
                        <span>✓ Secure payment</span>
                        <span>✓ 24/7 support</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upgrade
