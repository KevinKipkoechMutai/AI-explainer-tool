"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_VOICE,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";
import FileUploader from "./FileUploader";
import VoiceSelector from "./VoiceSelector";
import {useAuth} from "@clerk/nextjs";
import {toast} from "sonner";
import {checkBookExists, createBook, saveBookSegments} from "@/lib/actions/book.actions";
import {upload} from "@vercel/blob/client";
import {parsePDFFile} from "@/lib/utils";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: DEFAULT_VOICE,
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (values: BookUploadFormValues) => {
    if (!userId) {
      return toast.error("You must be logged in to upload a book.");
    }

    setIsSubmitting(true);

    try {
        const existsCheck = await checkBookExists(values.title);
        if (existsCheck.exists && existsCheck.data) {
          toast.info("Book with this title already exists.");
          form.reset()
            router.push(`/books/${existsCheck.data.slug}`);
            return
        }

        const fileTitle = values.title.replace(/\s+/g, '-').toLowerCase();
        const pdfFile = values.pdfFile
        const parsedPDF = await parsePDFFile(pdfFile);

        if (parsedPDF.content.length === 0) {
            toast.error("PDF is empty or contains no text.");
            return
        }

        const uploadedPDFBlob = await upload(fileTitle, pdfFile, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            contentType: 'application/pdf',
        })

        let coverURL: string

        if (values.coverImage) {
            const coverFile = values.coverImage
            const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                contentType: coverFile.type,
            })
            coverURL = uploadedCoverBlob.url
        } else {
            const response = await fetch(parsedPDF.cover)
            const blob = await response.blob()

            const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                contentType: 'image/png',
            })
            coverURL = uploadedCoverBlob.url
        }

        const book = await createBook({
            clerkId: userId,
            title: values.title,
            author: values.author,
            persona: values.persona,
            fileURL: uploadedPDFBlob.url,
            fileBlobKey: uploadedPDFBlob.pathname,
            coverURL,
            fileSize: pdfFile.size
        })

        if (!book.success) {
            if (book.isBillingError) {
                toast.error(book.error as string || "Failed to create book. Please upgrade your plan.");
                router.push("/subscriptions");
                return;
            }

            throw new Error("Failed to create book.");
        }

        if (book?.alreadyExists) {
            toast.info("Book with this title already exists.");
            form.reset()
            router.push(`/books/${book.data._id}`)
            return
        }

        const segments = await saveBookSegments(book.data._id, userId, parsedPDF.content)

        if (!segments.success) {
            toast.error("Failed to save book segments.");
        }

        form.reset()
        router.push('/')

    } catch (error) {
      console.error("Error uploading book:", error);
      toast.error("Failed to upload book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* PDF File Upload */}
          <FormField
            control={form.control}
            name="pdfFile"
            render={() => (
              <FileUploader
                control={form.control}
                name="pdfFile"
                label="Book PDF File"
                acceptTypes={ACCEPTED_PDF_TYPES}
                icon={Upload}
                placeholder="Click to upload PDF"
                hint="PDF file (max 50MB)"
                disabled={isSubmitting}
              />
            )}
          />

          {/* Cover Image Upload */}
          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FileUploader
                control={form.control}
                name="coverImage"
                label="Cover Image (Optional)"
                acceptTypes={ACCEPTED_IMAGE_TYPES}
                icon={ImageIcon}
                placeholder="Click to upload cover image"
                hint="Leave empty to auto-generate from PDF"
                disabled={isSubmitting}
              />
            )}
          />

          {/* Title Input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author Input */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice Selector */}
          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <FormControl>
                  <VoiceSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;

