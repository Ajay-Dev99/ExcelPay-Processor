import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { socket } from "./useSocket";

export interface UploadProgressItem {
    uploadId: number;
    processedRows: number;
}

export interface CompletedToastItem {
    uploadId: number;
    fileName: string;
    processedRows: number;
}

interface Options {
    userId: number | undefined;
    uploads: any[] | undefined;
    onCompleted: () => void;
}

export function useSocketUploads({ userId, uploads, onCompleted }: Options) {

    const [activeUploads, setActiveUploads] = useState<Record<number, UploadProgressItem>>({});
    const [completedToasts, setCompletedToasts] = useState<CompletedToastItem[]>([]);

  
    const uploadsRef = useRef(uploads);
    useEffect(() => { uploadsRef.current = uploads; }, [uploads]);

    const onCompletedRef = useRef(onCompleted);
    useEffect(() => { onCompletedRef.current = onCompleted; }, [onCompleted]);

    const timeoutRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    const dismissToast = useCallback((uploadId: number) => {
        setCompletedToasts(prev => prev.filter(t => t.uploadId !== uploadId));
    }, []);


    const startUpload = useCallback((uploadId: number) => {
        setActiveUploads(prev => ({
            ...prev,
            [uploadId]: { uploadId, processedRows: 0 }
        }));
    }, []);

    const dismissToastRef = useRef(dismissToast);
    useEffect(() => { dismissToastRef.current = dismissToast; }, [dismissToast]);

    useEffect(() => {

        if (!userId) return;

        const joinRoom = () => {
            socket.emit("join-room", String(userId));
            console.log("[socket] joined room user-" + userId);
        };

        if (!socket.connected) socket.connect();
        joinRoom();


        socket.on("connect", joinRoom);

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        const getFileName = (uploadId: number) =>
            uploadsRef.current?.find((u: any) => u.id === uploadId)?.fileName
            || `Upload #${uploadId}`;

        const scheduleDismiss = (uploadId: number) => {
            timeoutRefs.current[uploadId] = setTimeout(() => {
                dismissToastRef.current(uploadId);
                delete timeoutRefs.current[uploadId];
            }, 5000);
        };

        const onProgress = (data: any) => {
            console.log("[socket] upload-progress", data);
            setActiveUploads(prev => ({
                ...prev,
                [data.uploadId]: { uploadId: data.uploadId, processedRows: data.processedRows }
            }));
        };

        const onCompletedEvent = (data: any) => {
            console.log("[socket] upload-completed", data);
            const fileName = getFileName(data.uploadId);

            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });

            setCompletedToasts(prev => [
                ...prev,
                { uploadId: data.uploadId, fileName, processedRows: data.processedRows }
            ]);

            if (Notification.permission === "granted" && document.visibilityState === "hidden") {
                new Notification("✅ Processing Complete!", {
                    body: `${fileName} — ${data.processedRows.toLocaleString()} rows processed`,
                    icon: "/vite.svg"
                });
            }

            scheduleDismiss(data.uploadId);
            onCompletedRef.current();
        };

        const onFailed = (data: any) => {
            console.log("[socket] upload-failed", data);
            const fileName = getFileName(data.uploadId);

            setActiveUploads(prev => {
                const updated = { ...prev };
                delete updated[data.uploadId];
                return updated;
            });

            setCompletedToasts(prev => [
                ...prev,
                { uploadId: data.uploadId, fileName, processedRows: 0 }
            ]);

            if (Notification.permission === "granted" && document.visibilityState === "hidden") {
                new Notification("❌ Processing Failed", {
                    body: `${fileName} could not be processed. Please try again.`,
                    icon: "/vite.svg"
                });
            }
            onCompletedRef.current();

            scheduleDismiss(data.uploadId);
        };

        socket.on("upload-progress", onProgress);
        socket.on("upload-completed", onCompletedEvent);
        socket.on("upload-failed", onFailed);

        return () => {
            socket.off("connect", joinRoom);
            socket.off("upload-progress", onProgress);
            socket.off("upload-completed", onCompletedEvent);
            socket.off("upload-failed", onFailed);
            Object.values(timeoutRefs.current).forEach(clearTimeout);
            timeoutRefs.current = {};
        };

    }, [userId]);

    const activeList = useMemo(() => Object.values(activeUploads), [activeUploads]);

    return { activeList, completedToasts, dismissToast, startUpload };
}
