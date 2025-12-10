import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveInterviewQuestions = mutation({
    args: {
        questions: v.any(),
        uid: v.id('UserTable'),
        resumeUrl: v.string(),
        jobTitle: v.optional(v.string()),
        jobDescription: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('InterviewSessionTable', {
            interviewQuestions: args.questions,
            resumeUrl: args.resumeUrl,
            userId: args.uid,
            status: 'draft',
            jobTitle: args.jobTitle,
            jobDescription: args.jobDescription
        });
        return result;
    }
});

export const getInterviewQuestions = query({
    args: {
        interviewRecordId: v.id('InterviewSessionTable')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.interviewRecordId);
        return result;
    }
});

export const getUserInterviewAnswers = query({
    args: {
        interviewId: v.id('InterviewSessionTable')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('UserAnswerTable')
            .filter((q) => q.eq(q.field('interviewId'), args.interviewId))
            .collect();
        return result;
    }
});

export const saveUserAnswer = mutation({
    args: {
        interviewId: v.id('InterviewSessionTable'),
        question: v.string(),
        userAnswer: v.string(),
        createdAt: v.optional(v.string()),
        rating: v.optional(v.string()),
        feedback: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('UserAnswerTable', {
            interviewId: args.interviewId,
            question: args.question,
            userAnswer: args.userAnswer,
            createdAt: args.createdAt,
            rating: args.rating,
            feedback: args.feedback
        });
        return result;
    }
});

export const updateUserAnswerFeedback = mutation({
    args: {
        userAnswerId: v.id('UserAnswerTable'),
        feedback: v.string(),
        rating: v.number(),
        correctAnswer: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.userAnswerId, {
            feedback: args.feedback,
            rating: args.rating.toString(),
            correctAnswer: args.correctAnswer
        });
        return result;
    }
});
