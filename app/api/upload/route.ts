import {NextResponse} from "next/server";
import {handleUpload, HandleUploadBody} from "@vercel/blob/client";
import {auth} from "@clerk/nextjs/server";
import {MAX_FILE_SIZE} from "@/lib/constants";

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                const {userId} = await auth()
                if (!userId) {
                    throw new Error("Unauthorized: User not authenticated")
                }
                return {
                    allowedContentTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
                    addRandomSuffix: true,
                    maximumSizeInBytes: MAX_FILE_SIZE,
                    tokenPayload: JSON.stringify({userId}),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log("Blob uploaded successfully: ", blob.url)
                const payload = tokenPayload ? JSON.parse(tokenPayload) : null
                const userId = payload?.userId
            }
        })
        console.log("Upload response: ", jsonResponse)

        return NextResponse.json(jsonResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        const status = message.includes("Unauthorized") ? 401 : 500
        return NextResponse.json({error: message}, {status})
    }
}

