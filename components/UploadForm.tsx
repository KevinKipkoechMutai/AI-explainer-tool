"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel as ShadcnFormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "./LoadingOverlay";
import { cn } from "@/lib/utils";
import {DEFAULT_VOICE, ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES}from "@/lib/constants";

const formSchema = z.object({
  pdfFile: z.instanceof(File, { message: "PDF file is required" }),
  coverImage: z.instanceof(File).optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author Name is required"),
  voice: z.string().min(1, "Please choose an assistant voice"),
});

type FormValues = z.infer<typeof formSchema>;

const voices = {
  male: [
    { id: "dave", name: "Dave", description: "Young male, British-Essex, casual & conversational" },
    { id: "daniel", name: "Daniel", description: "Middle-aged male, British, authoritative but warm" },
    { id: "chris", name: "Chris", description: "Male, casual & easy-going" },
  ],
  female: [
    { id: "rachel", name: "Rachel", description: "Young female, American, calm & clear" },
    { id: "sarah", name: "Sarah", description: "Young female, American, soft & approachable" },
  ],
};

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: undefined,
      title: "",
      author: "",
      voice: DEFAULT_VOICE,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log(values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
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
            acceptTypes={ACCEPTED_PDF_TYPES}
            render={({ field }) => (
              <FormItem>
                <ShadcnFormLabel className="form-label">Book PDF File</ShadcnFormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="pdf-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setPdfName(file.name);
                        }
                      }}
                    />
                    <label
                      htmlFor="pdf-upload"
                      className={cn(
                        "upload-dropzone border-2 border-dashed border-[#8B7355]/30",
                        pdfName && "upload-dropzone-uploaded"
                      )}
                    >
                      {pdfName ? (
                        <div className="flex flex-col items-center">
                          <Upload className="upload-dropzone-icon" />
                          <div className="flex items-center gap-2">
                            <span className="upload-dropzone-text">{pdfName}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPdfName(null);
                                field.onChange(undefined);
                              }}
                              className="upload-dropzone-remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="upload-dropzone-icon" />
                          <span className="upload-dropzone-text">Click to upload PDF</span>
                          <span className="upload-dropzone-hint">PDF file (max 50MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image Upload */}
          <FormField
            control={form.control}
            name="coverImage"
            acceptTypes={ACCEPTED_IMAGE_TYPES}
            render={({ field }) => (
              <FormItem>
                <ShadcnFormLabel className="form-label">Cover Image (Optional)</ShadcnFormLabel>
                <FormControl>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="cover-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setCoverName(file.name);
                        }
                      }}
                    />
                    <label
                      htmlFor="cover-upload"
                      className={cn(
                        "upload-dropzone border-2 border-dashed border-[#8B7355]/30",
                        coverName && "upload-dropzone-uploaded"
                      )}
                    >
                      {coverName ? (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="upload-dropzone-icon" />
                          <div className="flex items-center gap-2">
                            <span className="upload-dropzone-text">{coverName}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCoverName(null);
                                field.onChange(undefined);
                              }}
                              className="upload-dropzone-remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="upload-dropzone-icon" />
                          <span className="upload-dropzone-text">Click to upload cover image</span>
                          <span className="upload-dropzone-hint">
                            Leave empty to auto-generate from PDF
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title Input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <ShadcnFormLabel className="form-label">Title</ShadcnFormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
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
                <ShadcnFormLabel className="form-label">Author Name</ShadcnFormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
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
            name="voice"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <ShadcnFormLabel className="form-label">Choose Assistant Voice</ShadcnFormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-[#777] mb-3">Male Voices</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {voices.male.map((voice) => (
                          <FormItem key={voice.id}>
                            <FormControl>
                              <RadioGroupItem
                                value={voice.id}
                                id={voice.id}
                                className="sr-only"
                              />
                            </FormControl>
                            <ShadcnFormLabel
                              htmlFor={voice.id}
                              className={cn(
                                "voice-selector-option flex-col items-start h-full",
                                field.value === voice.id
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    field.value === voice.id ? "border-[#663820]" : "border-gray-300"
                                )}>
                                    {field.value === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                                </div>
                                <span className="font-bold text-[#212a3b]">{voice.name}</span>
                              </div>
                              <span className="text-xs text-[#777] leading-relaxed">
                                {voice.description}
                              </span>
                            </ShadcnFormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-[#777] mb-3">Female Voices</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {voices.female.map((voice) => (
                          <FormItem key={voice.id}>
                            <FormControl>
                              <RadioGroupItem
                                value={voice.id}
                                id={voice.id}
                                className="sr-only"
                              />
                            </FormControl>
                            <ShadcnFormLabel
                              htmlFor={voice.id}
                              className={cn(
                                "voice-selector-option flex-col items-start h-full",
                                field.value === voice.id
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    field.value === voice.id ? "border-[#663820]" : "border-gray-300"
                                )}>
                                    {field.value === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                                </div>
                                <span className="font-bold text-[#212a3b]">{voice.name}</span>
                              </div>
                              <span className="text-xs text-[#777] leading-relaxed">
                                {voice.description}
                              </span>
                            </ShadcnFormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="form-btn">
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
