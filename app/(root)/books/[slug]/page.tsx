import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBookBySlug } from '@/lib/actions/book.actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MicOff, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import VapiControls from "@/components/VapiControls";


const BookDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/?error=unauthorized');
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect('/');
  }

  const book = result.data;

  return (
    <div className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[var(--text-primary)]" />
      </Link>

        {/* Transcript Area */}
        <VapiControls book={book} />
    </div>
  );
};

export default BookDetailsPage;
