"use server"

import { CreateBook, TextSegment } from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import {generateSlug, serializeData} from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";


export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase()

        const slug = generateSlug(title)

        const book = await Book.findOne({slug}).lean()

        if (book) {
            return {
                exists: true,
                data: serializeData(book)
            }
        }

        return {
            exists: false,
            data: null
        }
    } catch (e) {
        console.error("Error checking book existence: ", e)
        return {
            exists: false,
            error: e instanceof Error ? e.message : "Unknown error"
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {

        await connectToDatabase()

        const slug = generateSlug(data.title)

        const existingBook = await Book.findOne({slug}).lean()
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        }

        const book = await Book.create({...data, slug, totalSegments: 0})

        return {
            success: true,
            message: "Book created successfully",
            data: serializeData(book)
        }

    } catch (e) {
        console.error("Error creating book: ", e)
        return {
            success: false,
            message: "Failed to create book",
            error: e instanceof Error ? e.message : "Unknown error"
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase()
        console.log("Saving book segments...")

        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId, bookId, content: text, segmentIndex, pageNumber, wordCount
        }))

        await BookSegment.insertMany(segmentsToInsert)
        await Book.findByIdAndUpdate(bookId, {totalSegments: segments.length})
        console.log("Book segments saved successfully")

        return {
            success: true,
            data: { segmentsCreated: segments.length }
        }

    } catch (e) {
        console.error("Error saving book segments: ", e)
        await BookSegment.deleteMany({bookId})
        await Book.findByIdAndDelete(bookId)
        console.log("Delected book segments and book due to failure to save segments")
        return {
            success: false,
            message: "Failed to save book segments",
            error: e instanceof Error ? e.message : "Unknown error"
        }
    }
}
