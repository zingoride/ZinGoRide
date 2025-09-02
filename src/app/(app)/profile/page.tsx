
'use client';

import { DocumentUploadForm } from "@/components/document-upload-form";
import { ProfileForm } from "@/components/profile-form";
import { VehicleDetails } from "@/components/vehicle-details";

export default function ProfilePage() {
    return (
        <div className="grid gap-8">
            <ProfileForm />
            <VehicleDetails />
            <DocumentUploadForm />
        </div>
    )
}
