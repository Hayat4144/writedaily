import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InsertLinkForm from '@/components/forms/ImageLinkForm';
import UploadFile from './UploadFile';

export default function InsertImageTab() {
    return (
        <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="embed-link">Embed Link</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
                <UploadFile />
            </TabsContent>
            <TabsContent value="embed-link">
                <InsertLinkForm compType="image" />
            </TabsContent>
        </Tabs>
    );
}
