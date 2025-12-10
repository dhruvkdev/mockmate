"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const plans = [
    {
        name: 'Starter',
        price: '₹499',
        period: '/month',
        features: [
            '5 AI mock interviews per month',
            'Basic answer-level feedback',
            'Overall score & summary',
            'Access to student community'
        ],
        popular: false
    },
    {
        name: 'Pro Learner',
        price: '₹1,499',
        period: '/month',
        features: [
            'Unlimited AI mock interviews',
            'Advanced behavioral & technical analysis',
            'AI-powered resume & profile review',
            'Priority chat support',
            'Download PDF reports'
        ],
        popular: true
    },
    {
        name: 'Coaching',
        price: '₹4,999',
        period: '/month',
        features: [
            '1-on-1 interview coaching',
            'Role & company-specific mocks',
            'Offer negotiation guidance',
            'Dedicated mentor access',
            'Everything in Pro'
        ],
        popular: false
    }
]

function Upgrade() {
    const router = useRouter()

    return (
        <div className='py-20 px-10 md:px-28 lg:px-44 xl:px-56'>
            <div className='text-center mb-16'>
                <h1 className='text-4xl md:text-5xl font-bold mb-6'>
                    Choose Your Plan
                </h1>
                <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
                    Upgrade your interview preparation with our premium features.
                    All plans include AI-powered feedback and unlimited practice.
                </p>
            </div>

            <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl overflow-hidden shadow-xl border-2 flex flex-col ${plan.popular
                                ? 'border-purple-500 transform scale-105 z-10'
                                : 'border-gray-200'
                            }`}
                    >
                        {plan.popular && (
                            <div className='bg-purple-500 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2'>
                                <Sparkles size={16} />
                                MOST POPULAR
                            </div>
                        )}

                        <div className='p-8 bg-white flex-1 flex flex-col'>
                            <h3 className='text-2xl font-bold mb-4'>{plan.name}</h3>
                            <div className='mb-6'>
                                <span className='text-4xl font-bold'>{plan.price}</span>
                                <span className='text-gray-500'>{plan.period}</span>
                            </div>

                            <ul className='space-y-4 mb-8 flex-1'>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className='flex items-start gap-3'>
                                        <div className='w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                            <Check size={12} className='text-purple-600' />
                                        </div>
                                        <span className='text-gray-600'>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.popular
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : ''
                                    }`}
                                variant={plan.popular ? 'default' : 'outline'}
                            >
                                {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='text-center mt-12'>
                <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard')}
                >
                    ← Back to Dashboard
                </Button>
            </div>
        </div>
    )
}

export default Upgrade
